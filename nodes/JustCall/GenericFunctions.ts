import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';

export const JUSTCALL_BASE_URL = 'https://api.justcall.io';

/**
 * Make an authenticated API request to JustCall
 */
export async function justcallApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('justCallApi');

	if (!credentials) {
		throw new NodeApiError(this.getNode(), {
			message: 'No credentials returned!',
		} as JsonObject);
	}

	const options: IDataObject = {
		method,
		body,
		qs,
		uri: `${JUSTCALL_BASE_URL}${endpoint}`,
		json: true,
		headers: {
			Authorization: `${credentials.apiKey}:${credentials.apiSecret}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		...option,
	};

	// Remove empty body for GET requests
	if (method === 'GET' && Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'justCallApi', options);
	} catch (error) {
		// Sanitize error to prevent credential leakage
		const apiKey = credentials.apiKey as string;
		const apiSecret = credentials.apiSecret as string;

		if (error instanceof Error && error.message) {
			error.message = error.message.replace(new RegExp(apiKey, 'g'), '***');
			error.message = error.message.replace(new RegExp(apiSecret, 'g'), '***');
		}

		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: error instanceof Error ? error.message : 'JustCall API request failed',
		});
	}
}

/**
 * Make an authenticated API request to JustCall and return all items
 */
export async function justcallApiRequestAllItems(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any[]> {
	const returnData: any[] = [];
	let responseData;

	qs.page = 0;
	qs.per_page = 100;

	let hasMorePages = true;

	while (hasMorePages) {
		responseData = await justcallApiRequest.call(this, method, endpoint, body, qs);

		if (responseData[propertyName]) {
			returnData.push(...responseData[propertyName]);
		}

		// Check if there are more pages
		if (
			!responseData.meta ||
			responseData.meta.current_page === undefined ||
			responseData.meta.total_pages === undefined ||
			responseData.meta.current_page >= responseData.meta.total_pages - 1
		) {
			hasMorePages = false;
		} else {
			qs.page = (qs.page as number) + 1;
		}
	}

	return returnData;
}
