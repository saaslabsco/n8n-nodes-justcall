import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

import { triggerProperties } from './descriptions/TriggerDescription';
import {
	checkWebhookExists,
	createWebhook,
	deleteWebhook,
} from './handlers/TriggerWebhookHandler';
import { processWebhook } from './handlers/TriggerWebhookProcessor';

export class JustCallTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JustCall Trigger',
		name: 'justCallTrigger',
		icon: 'file:justcall.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when JustCall events occur',
		defaults: {
			name: 'JustCall Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'justCallApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: triggerProperties,
	};

	webhookMethods = {
		default: {
			/**
			 * Check if webhook already exists in JustCall
			 * Called by n8n before creating a webhook to avoid duplicates
			 */
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') || '';
				const event = (this.getNodeParameter('event') as string) || '';
				return await checkWebhookExists.call(this, webhookUrl, event);
			},

			/**
			 * Create/register webhook in JustCall
			 * Called automatically by n8n when the workflow is activated/executed
			 * This registers the webhook URL with JustCall for the specified event type
			 */
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') || '';
				const event = (this.getNodeParameter('event') as string) || '';
				return await createWebhook.call(this, webhookUrl, event);
			},

			/**
			 * Delete webhook from JustCall
			 * Called automatically by n8n when the workflow is deactivated/stopped
			 * This removes the webhook registration from JustCall
			 */
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') || '';
				const event = (this.getNodeParameter('event') as string) || '';
				return await deleteWebhook.call(this, webhookUrl, event);
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const event = this.getNodeParameter('event') as string;
		const additionalFields = this.getNodeParameter('additionalFields', {}) as IDataObject;
		return await processWebhook.call(this, event, additionalFields);
	}
}
