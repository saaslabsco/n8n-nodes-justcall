import { IWebhookFunctions, IWebhookResponseData, IDataObject } from 'n8n-workflow';
import {
	parseWebhookPayload,
	extractCallData,
	extractWebhookEvent,
	buildEnrichedData,
	normalizeDirection,
	isRegistrationCall,
} from '../utils/webhookHelpers';

/**
 * Process incoming webhook and apply filters
 */
export async function processWebhook(
	this: IWebhookFunctions,
	configuredEvent: string,
	additionalFields: IDataObject,
): Promise<IWebhookResponseData> {
	// Get webhook payload - try multiple methods to get the data
	let bodyData: any = this.getBodyData();

	// Also try to get the raw request if available
	try {
		const req = this.getRequestObject();
		if (req && req.body && (!bodyData || Object.keys(bodyData).length === 0)) {
			bodyData = req.body;
		}
	} catch (error) {
		// getRequestObject might not be available, that's okay
		// Continue with bodyData only
	}

	// Parse the webhook payload
	let rawPayload: IDataObject;
	try {
		rawPayload = parseWebhookPayload(bodyData);
	} catch (error) {
		// Return error if we can't parse
		return {
			workflowData: [
				this.helpers.returnJsonArray({
					error: error instanceof Error ? error.message : 'Failed to parse webhook payload',
				}),
			],
		};
	}

	// Extract event type and call data
	const webhookEvent = extractWebhookEvent(rawPayload);
	const callData = extractCallData(rawPayload);

	// Check if this is a registration/verification call
	// Registration calls only contain fields like 'type', 'event', 'webhook_url', 'request_id'
	// and don't have actual event data (call_id, call_sid, etc.)
	// If it's a registration call, return response without workflowData to prevent workflow execution
	const isRegistration = isRegistrationCall(rawPayload, callData);
	
	if (isRegistration) {
		// This is a registration/verification call from JustCall
		// Return response without workflowData to prevent workflow execution
		// This ensures the trigger doesn't complete during webhook registration
		// Following n8n pattern: omit workflowData for non-event calls
		return {
			workflowData: undefined,
		};
	}

	// Build enriched data with all call information
	const enrichedData = buildEnrichedData(rawPayload, callData, webhookEvent, configuredEvent);

	// Filter based on event type (unless listening to all events)
	if (configuredEvent !== '*' && webhookEvent !== configuredEvent) {
		return {
			workflowData: [],
		};
	}

	// Apply additional filters if specified
	if (additionalFields.agent_id) {
		const dataAgentId = callData.agent_id?.toString();
		const filterAgentId = additionalFields.agent_id.toString();
		if (dataAgentId !== filterAgentId) {
			return {
				workflowData: [],
			};
		}
	}

	if (additionalFields.direction) {
		// Direction is in call_info.direction
		const callInfo = callData.call_info as IDataObject;
		const direction = normalizeDirection(callInfo?.direction?.toString());
		const filterDirection = additionalFields.direction.toString().toLowerCase();

		if (direction !== filterDirection) {
			return {
				workflowData: [],
			};
		}
	}

	// Return the enriched data to trigger the workflow
	return {
		workflowData: [this.helpers.returnJsonArray(enrichedData)],
	};
}

