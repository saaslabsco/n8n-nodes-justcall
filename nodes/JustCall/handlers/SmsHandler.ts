import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { justcallApiRequest } from '../GenericFunctions';
import { handlePaginatedRequest, createExecutionData, formatDateTime } from '../utils/helpers';

export async function handleSmsOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'send':
			return await handleSendSms.call(this, i);
		case 'get':
			return await handleGetSms.call(this, i);
		case 'getMany':
			return await handleGetManySms.call(this, i);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
				itemIndex: i,
			});
	}
}

async function handleSendSms(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const justcallNumber = this.getNodeParameter('justcallNumber', i) as string;
	const contactNumber = this.getNodeParameter('contactNumber', i) as string;
	const message = this.getNodeParameter('message', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	if (!justcallNumber || !contactNumber || !message) {
		throw new NodeOperationError(
			this.getNode(),
			'JustCall Number, Contact Number, and Message are required',
			{
				itemIndex: i,
			},
		);
	}

	const body: IDataObject = {
		justcall_number: justcallNumber,
		contact_number: contactNumber,
		body: message,
	};

	if (additionalFields.media_url) {
		body.media_url = additionalFields.media_url;
	}
	if (additionalFields.contact_id) {
		body.contact_id = additionalFields.contact_id;
	}

	const responseData = await justcallApiRequest.call(
		this,
		'POST',
		'/v2.1/texts/new',
		body,
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

async function handleGetSms(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const smsId = this.getNodeParameter('smsId', i) as string;

	if (!smsId) {
		throw new NodeOperationError(this.getNode(), 'SMS ID is required', { itemIndex: i });
	}

	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`/v2.1/texts/${smsId}`,
		{},
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

async function handleGetManySms(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFilters.contact_id) {
		qs.contact_id = additionalFilters.contact_id;
	}
	if (additionalFilters.date_from) {
		const formattedDateTime = formatDateTime(additionalFilters.date_from as string | Date);
		if (formattedDateTime) {
			qs.date_from = formattedDateTime;
		}
	}
	if (additionalFilters.date_to) {
		const formattedDateTime = formatDateTime(additionalFilters.date_to as string | Date);
		if (formattedDateTime) {
			qs.date_to = formattedDateTime;
		}
	}
	if (additionalFilters.from_number) {
		qs.from_number = additionalFilters.from_number;
	}
	if (additionalFilters.to_number) {
		qs.to_number = additionalFilters.to_number;
	}

	const responseData = await handlePaginatedRequest.call(this, '/v2.1/texts', qs, i);
	return createExecutionData.call(this, responseData, i);
}

