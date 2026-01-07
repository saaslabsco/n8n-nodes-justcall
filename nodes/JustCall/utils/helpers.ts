import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { justcallApiRequest, justcallApiRequestAllItems } from '../GenericFunctions';

/**
 * Helper function to handle paginated GET requests
 */
export async function handlePaginatedRequest(
	this: IExecuteFunctions,
	endpoint: string,
	qs: IDataObject,
	i: number,
): Promise<any[]> {
	const returnAll = this.getNodeParameter('returnAll', i);

	if (returnAll) {
		return await justcallApiRequestAllItems.call(this, 'data', 'GET', endpoint, {}, qs);
	} else {
		const limit = this.getNodeParameter('limit', i);
		qs.per_page = limit;
		qs.page = 0;
		const response = await justcallApiRequest.call(this, 'GET', endpoint, {}, qs);
		return response.data || [];
	}
}

/**
 * Helper function to parse JSON fields safely
 * Returns the parsed object or throws an error with the field name
 */
export function parseJsonField(
	fieldValue: string | undefined,
	fieldName: string,
): IDataObject | undefined {
	if (!fieldValue) {
		return undefined;
	}

	try {
		return JSON.parse(fieldValue) as IDataObject;
	} catch (error) {
		// Error will be caught and wrapped by the caller with NodeOperationError
		throw new Error(`${fieldName} must be valid JSON`);
	}
}

/**
 * Helper function to parse comma-separated tags
 */
export function parseTags(tagsString: string | undefined): string[] | undefined {
	if (!tagsString) {
		return undefined;
	}
	return tagsString.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
}

/**
 * Helper function to format datetime to yyyy-mm-dd hh:mm:ss format
 */
export function formatDateTime(dateTimeValue: string | Date | undefined): string | undefined {
	if (!dateTimeValue) {
		return undefined;
	}

	let date: Date;
	if (typeof dateTimeValue === 'string') {
		date = new Date(dateTimeValue);
	} else {
		date = dateTimeValue;
	}

	if (isNaN(date.getTime())) {
		return undefined;
	}

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Helper function to create execution data from response
 */
export function createExecutionData(
	this: IExecuteFunctions,
	responseData: any,
	i: number,
): INodeExecutionData[] {
	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);
}

