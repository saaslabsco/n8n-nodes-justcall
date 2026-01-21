import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { justcallApiRequest } from '../GenericFunctions';
import { handlePaginatedRequest, createExecutionData, formatDateTime } from '../utils/helpers';

export async function handleCallOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {

	switch (operation) {
		case 'getMany':
			return await handleGetManyCalls.call(this, i);
		case 'get':
			return await handleGetCall.call(this, i);
		case 'update':
			return await handleUpdateCall.call(this, i);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
				itemIndex: i,
			});
	}
}

async function handleGetManyCalls(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;

	const qs: IDataObject = {};

	// Add filters
	if (additionalFilters.agent_id) {
		qs.agent_id = additionalFilters.agent_id;
	}
	if (additionalFilters.contact_number) {
		qs.contact_number = additionalFilters.contact_number;
	}
	if (additionalFilters.from_datetime) {
		const formattedDateTime = formatDateTime(additionalFilters.from_datetime as string | Date);
		if (formattedDateTime) {
			qs.from_datetime = formattedDateTime;
		}
	}
	if (additionalFilters.to_datetime) {
		const formattedDateTime = formatDateTime(additionalFilters.to_datetime as string | Date);
		if (formattedDateTime) {
			qs.to_datetime = formattedDateTime;
		}
	}
	if (additionalFilters.direction) {
		qs.direction = additionalFilters.direction;
	}
	if (additionalFilters.phone_number) {
		qs.phone_number = additionalFilters.phone_number;
	}
	if (additionalFilters.status) {
		qs.status = additionalFilters.status;
	}
	if (additionalFilters.order) {
		qs.order = additionalFilters.order;
	}
	if (additionalFilters.last_call_id_fetched) {
		qs.last_call_id_fetched = additionalFilters.last_call_id_fetched;
	}
	if (additionalFilters.fetch_ai_data !== undefined) {
		qs.fetch_ai_data = additionalFilters.fetch_ai_data;
	}

	const responseData = await handlePaginatedRequest.call(this, '/v2.1/calls', qs, i);
	return createExecutionData.call(this, responseData, i);
}

async function handleGetCall(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const callId = this.getNodeParameter('callId', i) as string;

	if (!callId) {
		throw new NodeOperationError(this.getNode(), 'Call ID is required', { itemIndex: i });
	}

	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`/v2.1/calls/${callId}`,
		{},
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

async function handleUpdateCall(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const callId = this.getNodeParameter('callId', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	if (!callId) {
		throw new NodeOperationError(this.getNode(), 'Call ID is required', { itemIndex: i });
	}

	const body: IDataObject = {};

	if (additionalFields.notes) {
		body.notes = additionalFields.notes;
	}
	if (additionalFields.disposition) {
		body.disposition = additionalFields.disposition;
	}
	if (additionalFields.rating) {
		body.rating = additionalFields.rating;
	}

	if (Object.keys(body).length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'At least one field (notes, disposition, or rating) must be provided',
			{ itemIndex: i },
		);
	}

	const responseData = await justcallApiRequest.call(
		this,
		'PUT',
		`/v2.1/calls/${callId}`,
		body,
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

