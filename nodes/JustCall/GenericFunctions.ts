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
		url: `${JUSTCALL_BASE_URL}${endpoint}`,
		json: true,
		...option,
	};

	// Remove empty body for GET requests
	if (method === 'GET' && Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'justCallApi', options as any);
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
 * @param perPage - Results per page (default 100). Use 20 for JustCall AI list APIs per API docs.
 */
export async function justcallApiRequestAllItems(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	perPage = 100,
): Promise<any[]> {
	const returnData: any[] = [];
	let responseData;

	qs.page = 0;
	qs.per_page = perPage;

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

/**
 * Make an authenticated GET request to JustCall and return the response as a buffer (e.g. for file download)
 */
export async function justcallApiRequestBinary(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	endpoint: string,
): Promise<Buffer> {
	const credentials = await this.getCredentials('justCallApi');

	if (!credentials) {
		throw new NodeApiError(this.getNode(), {
			message: 'No credentials returned!',
		} as JsonObject);
	}

	const options = {
		method: 'GET' as const,
		url: `${JUSTCALL_BASE_URL}${endpoint}`,
		encoding: 'arraybuffer' as const,
		headers: {
			Authorization: `${credentials.apiKey}:${credentials.apiSecret}`,
			'x-justcall-client': 'n8n',
		},
	};

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'justCallApi',
			options as any,
		);
		return Buffer.isBuffer(response) ? response : Buffer.from(response as ArrayBuffer);
	} catch (error) {
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
