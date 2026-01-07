import { IDataObject } from 'n8n-workflow';

/**
 * Registration fields that should be excluded from call data extraction
 */
const REGISTRATION_FIELDS = ['type', 'event', 'webhook_url', 'request_id'];

/**
 * Fields that indicate this is an actual event webhook (not a registration call)
 * These fields are present in real JustCall event payloads
 */
const EVENT_INDICATOR_FIELDS = [
	'call_id',
	'call_sid',
	'contact_number',
	'agent_id',
	'from_number',
	'to_number',
	'call_info',
	'sms_id',
	'text_id',
	'voicemail_id',
	// Additional fields that might be present in real events
	'duration',
	'status',
	'recording_url',
	'transcript',
	'contact_id',
	'phone_number',
	'message',
	'media_url',
	'timestamp',
	'created_at',
	'updated_at',
];

/**
 * Extract and parse webhook payload from body data
 */
export function parseWebhookPayload(bodyData: any): IDataObject {
	if (typeof bodyData === 'object' && bodyData !== null) {
		return bodyData as IDataObject;
	}

	if (typeof bodyData === 'string') {
		try {
			return JSON.parse(bodyData) as IDataObject;
		} catch (error) {
			throw new Error('Failed to parse webhook body as JSON');
		}
	}

	return {};
}

/**
 * Extract call data from webhook payload
 * JustCall sends call data at root level (not nested in 'data' property)
 */
export function extractCallData(rawPayload: IDataObject): IDataObject {
	// Check if data is nested in 'data' property (some APIs use this)
	if (rawPayload.data && typeof rawPayload.data === 'object') {
		return rawPayload.data as IDataObject;
	}

	// JustCall sends call data at root level
	// Exclude webhook registration/validation fields
	const callData: IDataObject = {};
	for (const key in rawPayload) {
		if (
			!REGISTRATION_FIELDS.includes(key) &&
			rawPayload[key] !== null &&
			rawPayload[key] !== undefined
		) {
			callData[key] = rawPayload[key];
		}
	}

	return callData;
}

/**
 * Extract event type from webhook payload
 */
export function extractWebhookEvent(rawPayload: IDataObject): string {
	return (rawPayload.type as string) || (rawPayload.event as string) || '';
}

/**
 * Extract call ID from webhook payload (tries multiple field names)
 */
export function extractCallId(callData: IDataObject, rawPayload: IDataObject): string {
	const candidates = [
		callData.call_id,
		callData.call_sid,
		callData.id,
		callData.callId,
		rawPayload.call_id,
		rawPayload.call_sid,
		rawPayload.id,
	];

	for (const candidate of candidates) {
		if (candidate !== null && candidate !== undefined && candidate !== '') {
			return String(candidate);
		}
	}

	return '';
}

/**
 * Build enriched data object with all webhook information
 */
export function buildEnrichedData(
	rawPayload: IDataObject,
	callData: IDataObject,
	webhookEvent: string,
	configuredEvent: string,
): IDataObject {
	const callId = extractCallId(callData, rawPayload);

	return {
		// Start with all raw payload data
		...rawPayload,
		// Override with callData (which excludes registration fields)
		...callData,
		// Ensure call_id is always available and prioritized
		call_id: callId,
		// Ensure event is set
		event: webhookEvent || configuredEvent,
	};
}

/**
 * Normalize direction value (Outgoing -> outbound, Incoming -> inbound)
 */
export function normalizeDirection(direction: string | undefined): string | undefined {
	if (!direction) {
		return undefined;
	}

	const lowerDirection = String(direction).toLowerCase();
	if (lowerDirection === 'outgoing') {
		return 'outbound';
	}
	if (lowerDirection === 'incoming') {
		return 'inbound';
	}
	return lowerDirection;
}

/**
 * Check if the webhook payload is a registration/verification call
 * Registration calls only contain registration fields and no actual event data
 * 
 * IMPORTANT: This function should be conservative - only return true if we're CERTAIN it's a registration call
 * We'd rather let a registration call through than block a real event
 */
export function isRegistrationCall(rawPayload: IDataObject, callData: IDataObject): boolean {
	// PRIORITY 1: Check if payload contains any event indicator fields FIRST
	// If it does, it's definitely an actual event webhook, not a registration call
	// This check must happen first to avoid false positives
	for (const field of EVENT_INDICATOR_FIELDS) {
		const rawValue = rawPayload[field];
		const callDataValue = callData[field];
		
		// Check if the value exists and is not empty/null
		if (
			(rawValue !== null && rawValue !== undefined && rawValue !== '') ||
			(callDataValue !== null && callDataValue !== undefined && callDataValue !== '')
		) {
			return false; // This is an actual event, not a registration call
		}
	}

	// PRIORITY 2: Very strict check - only consider it registration if:
	// 1. Has webhook_url field (registration indicator)
	// 2. AND has NO event data (already checked above)
	// 3. AND has very few fields (only registration fields)
	const payloadKeys = Object.keys(rawPayload);
	
	// If payload has webhook_url AND only has registration fields (type, event, webhook_url, request_id)
	// AND no call data exists, then it's definitely a registration call
	if (rawPayload.webhook_url && typeof rawPayload.webhook_url === 'string') {
		const hasOnlyRegistrationFields = payloadKeys.every((key) => REGISTRATION_FIELDS.includes(key));
		const hasNoCallData = !callData || Object.keys(callData).length === 0;
		
		// Only return true if it ONLY has registration fields and no call data
		if (hasOnlyRegistrationFields && hasNoCallData) {
			return true;
		}
	}

	// PRIORITY 3: Check if payload has ONLY 'type' and/or 'event' fields (very minimal registration call)
	// This is the most conservative check - only 1-2 fields that are registration-related
	if (payloadKeys.length <= 2) {
		const hasOnlyTypeEvent = payloadKeys.every(
			key => key === 'type' || key === 'event' || key === 'webhook_url' || key === 'request_id'
		);
		
		if (hasOnlyTypeEvent && (!callData || Object.keys(callData).length === 0)) {
			return true;
		}
	}

	// PRIORITY 4: If payload is completely empty, it's likely a registration call
	if (payloadKeys.length === 0) {
		return true;
	}

	// Default: If we're not certain it's a registration call, treat it as a real event
	// This ensures we don't accidentally filter out real events
	return false;
}

