import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { justcallApiRequest } from '../GenericFunctions';
import { handlePaginatedRequest, createExecutionData, formatDateTime } from '../utils/helpers';

/**
 * List calls AI data - GET /v2.1/calls_ai
 */
async function handleListCallsAiData(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;
	const qs: IDataObject = {};
	if (additionalFilters.fetch_transcription !== undefined) {
		qs.fetch_transcription = additionalFilters.fetch_transcription;
	}
	if (additionalFilters.fetch_summary !== undefined) {
		qs.fetch_summary = additionalFilters.fetch_summary;
	}
	if (additionalFilters.fetch_ai_insights !== undefined) {
		qs.fetch_ai_insights = additionalFilters.fetch_ai_insights;
	}
	if (additionalFilters.fetch_action_items !== undefined) {
		qs.fetch_action_items = additionalFilters.fetch_action_items;
	}
	if (additionalFilters.fetch_smart_chapters !== undefined) {
		qs.fetch_smart_chapters = additionalFilters.fetch_smart_chapters;
	}
	if (additionalFilters.from_datetime) {
		const formatted = formatDateTime(additionalFilters.from_datetime as string | Date);
		if (formatted) qs.from_datetime = formatted;
	}
	if (additionalFilters.to_datetime) {
		const formatted = formatDateTime(additionalFilters.to_datetime as string | Date);
		if (formatted) qs.to_datetime = formatted;
	}
	if (additionalFilters.phone_number) {
		qs.phone_number = additionalFilters.phone_number;
	}
	if (additionalFilters.platform) {
		qs.platform = additionalFilters.platform;
	}
	if (additionalFilters.agent_id) {
		qs.agent_id = additionalFilters.agent_id;
	}
	// JustCall AI list APIs: default 10, max 20 per page per API docs
	const responseData = await handlePaginatedRequest.call(this, '/v2.1/calls_ai', qs, i, 20);
	return createExecutionData.call(this, responseData, i);
}

/**
 * Get call AI data - GET /v2.1/calls_ai/{id}
 */
async function handleGetCallAiData(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const callId = this.getNodeParameter('callId', i) as string;
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;
	if (!callId) {
		throw new NodeOperationError(this.getNode(), 'Call ID is required', { itemIndex: i });
	}
	const qs: IDataObject = {};
	if (additionalFilters?.fetch_transcription !== undefined) {
		qs.fetch_transcription = additionalFilters.fetch_transcription;
	}
	if (additionalFilters?.fetch_summary !== undefined) {
		qs.fetch_summary = additionalFilters.fetch_summary;
	}
	if (additionalFilters?.fetch_ai_insights !== undefined) {
		qs.fetch_ai_insights = additionalFilters.fetch_ai_insights;
	}
	if (additionalFilters?.fetch_action_items !== undefined) {
		qs.fetch_action_items = additionalFilters.fetch_action_items;
	}
	if (additionalFilters?.fetch_smart_chapters !== undefined) {
		qs.fetch_smart_chapters = additionalFilters.fetch_smart_chapters;
	}
	if (additionalFilters?.platform) {
		qs.platform = additionalFilters.platform;
	}
	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`/v2.1/calls_ai/${callId}`,
		{},
		qs,
	);
	return createExecutionData.call(this, responseData, i);
}

/**
 * List meetings AI data - GET /v2.1/meetings_ai
 * Params: fetch_transcription, fetch_summary, fetch_ai_insights, meeting_id (optional filter)
 */
async function handleListMeetingsAiData(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;
	const qs: IDataObject = {};
	if (additionalFilters.fetch_transcription !== undefined) {
		qs.fetch_transcription = additionalFilters.fetch_transcription;
	}
	if (additionalFilters.fetch_summary !== undefined) {
		qs.fetch_summary = additionalFilters.fetch_summary;
	}
	if (additionalFilters.fetch_ai_insights !== undefined) {
		qs.fetch_ai_insights = additionalFilters.fetch_ai_insights;
	}
	if (additionalFilters.meeting_id) {
		qs.meeting_id = additionalFilters.meeting_id;
	}
	if (additionalFilters.agent_id) {
		qs.agent_id = additionalFilters.agent_id;
	}
	if (additionalFilters.platform) {
		qs.platform = additionalFilters.platform;
	}
	if (additionalFilters.fetch_smart_chapters !== undefined) {
		qs.fetch_smart_chapters = additionalFilters.fetch_smart_chapters;
	}
	if (additionalFilters.from_datetime) {
		const formatted = formatDateTime(additionalFilters.from_datetime as string | Date);
		if (formatted) qs.from_datetime = formatted;
	}
	if (additionalFilters.to_datetime) {
		const formatted = formatDateTime(additionalFilters.to_datetime as string | Date);
		if (formatted) qs.to_datetime = formatted;
	}
	// JustCall AI list APIs: default 10, max 20 per page per API docs
	const responseData = await handlePaginatedRequest.call(this, '/v2.1/meetings_ai', qs, i, 20);
	return createExecutionData.call(this, responseData, i);
}

/**
 * Get meeting AI data - GET /v2.1/meetings_ai/{instance_sid}
 */
async function handleGetMeetingAiData(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const instanceSid = this.getNodeParameter('instanceSid', i) as string;
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;
	if (!instanceSid) {
		throw new NodeOperationError(this.getNode(), 'Meeting Instance SID is required', {
			itemIndex: i,
		});
	}
	const qs: IDataObject = {};
	if (additionalFilters?.fetch_transcription !== undefined) {
		qs.fetch_transcription = additionalFilters.fetch_transcription;
	}
	if (additionalFilters?.fetch_summary !== undefined) {
		qs.fetch_summary = additionalFilters.fetch_summary;
	}
	if (additionalFilters?.fetch_ai_insights !== undefined) {
		qs.fetch_ai_insights = additionalFilters.fetch_ai_insights;
	}
	if (additionalFilters?.fetch_smart_chapters !== undefined) {
		qs.fetch_smart_chapters = additionalFilters.fetch_smart_chapters;
	}
	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`/v2.1/meetings_ai/${instanceSid}`,
		{},
		qs,
	);
	return createExecutionData.call(this, responseData, i);
}

export async function handleJustCallAiOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listCallsAiData':
			return await handleListCallsAiData.call(this, i);
		case 'getCallAiData':
			return await handleGetCallAiData.call(this, i);
		case 'listMeetingsAiData':
			return await handleListMeetingsAiData.call(this, i);
		case 'getMeetingAiData':
			return await handleGetMeetingAiData.call(this, i);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
				itemIndex: i,
			});
	}
}
