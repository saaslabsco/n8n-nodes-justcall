import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { justcallApiRequest } from '../GenericFunctions';
import { handlePaginatedRequest, createExecutionData } from '../utils/helpers';

export async function handlePhoneNumberOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getMany':
			return await handleGetManyPhoneNumbers.call(this, i);
		case 'get':
			return await handleGetPhoneNumber.call(this, i);
		case 'detectIncoming':
			return await handleDetectIncomingNumber.call(this, i);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
				itemIndex: i,
			});
	}
}

async function handleGetManyPhoneNumbers(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const qs: IDataObject = {};
	const responseData = await handlePaginatedRequest.call(this, '/v2.1/phone-numbers', qs, i);
	return createExecutionData.call(this, responseData, i);
}

async function handleGetPhoneNumber(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;

	if (!phoneNumberId) {
		throw new NodeOperationError(this.getNode(), 'Phone Number ID is required', {
			itemIndex: i,
		});
	}

	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`/v2.1/phone-numbers/${phoneNumberId}`,
		{},
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

async function handleDetectIncomingNumber(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;

	if (!phoneNumber) {
		throw new NodeOperationError(this.getNode(), 'Phone Number is required', {
			itemIndex: i,
		});
	}

	const body: IDataObject = {
		phone_number: phoneNumber,
	};

	const responseData = await justcallApiRequest.call(
		this,
		'POST',
		'/v2.1/phone-numbers/detect-incoming',
		body,
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

