import { IHookFunctions, IDataObject } from 'n8n-workflow';
import { justcallApiRequest } from '../GenericFunctions';

interface WebhookUrlEntry {
	webhook_url: string;
	url_id?: string;
}

interface WebhookData {
	type: string;
	webhook_urls?: WebhookUrlEntry[];
}

interface WebhooksResponse {
	data?: WebhookData[];
}

/**
 * Check if a webhook already exists in JustCall
 * Called by n8n before creating a webhook to avoid duplicates
 */
export async function checkWebhookExists(
	this: IHookFunctions,
	webhookUrl: string,
	event: string,
): Promise<boolean> {
	try {
		const webhooks = (await justcallApiRequest.call(
			this,
			'GET',
			'/v2.1/webhooks',
			{},
			{},
		)) as WebhooksResponse;

		if (webhooks.data && Array.isArray(webhooks.data)) {
			for (const webhook of webhooks.data) {
				// Check if event type matches
				if (webhook.type === event) {
					// Check if webhook URL exists in the webhook_urls array
					if (webhook.webhook_urls && Array.isArray(webhook.webhook_urls)) {
						for (const urlEntry of webhook.webhook_urls) {
							if (urlEntry.webhook_url === webhookUrl) {
								return true;
							}
						}
					}
				}
			}
		}
	} catch (error) {
		// If endpoint doesn't exist or returns error, assume webhook doesn't exist
		return false;
	}

	return false;
}

/**
 * Create a webhook in JustCall
 * Called automatically by n8n when the workflow is activated/executed
 * This registers the webhook URL with JustCall for the specified event type
 * 
 * Flow:
 * 1. When workflow is activated (via UI or API), n8n calls this method
 * 2. When workflow is executed via /rest/workflows/{id}/run, if webhook doesn't exist, it should be created
 * 3. This ensures the webhook is registered before the workflow starts listening for events
 */
export async function createWebhook(
	this: IHookFunctions,
	webhookUrl: string,
	event: string,
): Promise<boolean> {
	if (!webhookUrl || !event) {
		return false;
	}

	// First check if webhook already exists to avoid duplicates
	const exists = await checkWebhookExists.call(this, webhookUrl, event);
	if (exists) {
		// Webhook already exists, no need to create again
		return true;
	}

	const body: IDataObject = {
		webhook_url: webhookUrl,
		type: event,
	};

	try {
		await justcallApiRequest.call(this, 'POST', '/v2.1/webhooks', body, {});
		return true;
	} catch (error) {
		// Log error but return true to allow manual webhook setup
		// This allows the workflow to activate even if automatic creation fails
		return true;
	}
}

/**
 * Delete a webhook from JustCall
 * This is called automatically when the workflow is deactivated/stopped
 */
export async function deleteWebhook(
	this: IHookFunctions,
	webhookUrl: string,
	event: string,
): Promise<boolean> {
	if (!webhookUrl || !event) {
		// Can't delete without webhook URL or event
		return false;
	}

	try {
		const webhooks = (await justcallApiRequest.call(
			this,
			'GET',
			'/v2.1/webhooks',
			{},
			{},
		)) as WebhooksResponse;

		if (webhooks.data && Array.isArray(webhooks.data)) {
			for (const webhook of webhooks.data) {
				// Check if event type matches
				if (webhook.type === event) {
					// Check if webhook URL exists in the webhook_urls array
					if (webhook.webhook_urls && Array.isArray(webhook.webhook_urls)) {
						for (const urlEntry of webhook.webhook_urls) {
							if (urlEntry.webhook_url === webhookUrl && urlEntry.url_id) {
								// Delete the webhook URL using the url_id
								try {
									await justcallApiRequest.call(
										this,
										'DELETE',
										`/v2.1/webhooks/url/${urlEntry.url_id}`,
										{},
										{},
									);
									return true;
								} catch (deleteError) {
									// Log error but continue trying other webhooks
								}
							}
						}
					}
				}
			}
		}
	} catch (error) {
		// If deletion fails, log but don't throw
		// Return false to indicate deletion may not have succeeded
		return false;
	}

	return false;
}

