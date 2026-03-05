import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { justcallApiRequest } from '../GenericFunctions';
import { handlePaginatedRequest, createExecutionData, formatDateTime } from '../utils/helpers';

const SALES_DIALER_BASE = '/v2.1/sales_dialer';

export async function handleSalesDialerOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listCalls':
			return await handleListCalls.call(this, i);
		case 'getCall':
			return await handleGetCall.call(this, i);
		case 'listCampaigns':
			return await handleListCampaigns.call(this, i);
		case 'getCampaign':
			return await handleGetCampaign.call(this, i);
		case 'listCampaignContacts':
			return await handleListCampaignContacts.call(this, i);
		case 'addContactToCampaign':
			return await handleAddContactToCampaign.call(this, i);
		case 'listContacts':
			return await handleListContacts.call(this, i);
		case 'getContact':
			return await handleGetContact.call(this, i);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
				itemIndex: i,
			});
	}
}

/**
 * List all Sales Dialer calls - GET /v2.1/sales_dialer/calls
 * @see https://developer.justcall.io/reference/sales_dialer_call_list_v21
 */
async function handleListCalls(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;
	const qs: IDataObject = {};
	if (additionalFilters.agent_id) qs.agent_id = additionalFilters.agent_id;
	if (additionalFilters.campaign_id) qs.campaign_id = additionalFilters.campaign_id;
	if (additionalFilters.call_type) qs.call_type = additionalFilters.call_type;
	if (additionalFilters.contact_number) qs.contact_number = additionalFilters.contact_number;
	if (additionalFilters.fetch_ai_data === true) qs.fetch_ai_data = true;
	if (additionalFilters.from_datetime) {
		const formatted = formatDateTime(additionalFilters.from_datetime as string | Date);
		if (formatted) qs.from_datetime = formatted;
	}
	if (additionalFilters.to_datetime) {
		const formatted = formatDateTime(additionalFilters.to_datetime as string | Date);
		if (formatted) qs.to_datetime = formatted;
	}
	if (additionalFilters.order) qs.order = additionalFilters.order;
	if (additionalFilters.last_call_id_fetched) {
		qs.last_call_id_fetched = additionalFilters.last_call_id_fetched;
	}
	if (additionalFilters.sales_dialer_number) qs.sales_dialer_number = additionalFilters.sales_dialer_number;
	const responseData = await handlePaginatedRequest.call(
		this,
		`${SALES_DIALER_BASE}/calls`,
		qs,
		i,
	);
	return createExecutionData.call(this, responseData, i);
}

/**
 * Get a Sales Dialer call - GET /v2.1/sales_dialer/calls/{id}
 * @see https://developer.justcall.io/reference/sales_dialer_call_get_v21
 * Query: fetch_ai_data (optional)
 */
async function handleGetCall(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const callId = this.getNodeParameter('callId', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	if (!callId) {
		throw new NodeOperationError(this.getNode(), 'Call ID is required', { itemIndex: i });
	}
	const qs: IDataObject = {};
	if (additionalFields?.fetch_ai_data !== undefined) {
		qs.fetch_ai_data = additionalFields.fetch_ai_data;
	}
	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`${SALES_DIALER_BASE}/calls/${callId}`,
		{},
		qs,
	);
	return createExecutionData.call(this, responseData, i);
}

/**
 * List all Sales Dialer campaigns - GET /v2.1/sales_dialer/campaigns
 * Query: contact_number, sales_dialer_number, type, from_datetime, to_datetime, page, per_page
 */
async function handleListCampaigns(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;
	const qs: IDataObject = {};
	if (additionalFilters?.contact_number) qs.contact_number = additionalFilters.contact_number;
	if (additionalFilters?.sales_dialer_number) qs.sales_dialer_number = additionalFilters.sales_dialer_number;
	if (additionalFilters?.type) qs.type = additionalFilters.type;
	if (additionalFilters?.from_datetime) {
		const formatted = formatDateTime(additionalFilters.from_datetime as string | Date);
		if (formatted) qs.from_datetime = formatted;
	}
	if (additionalFilters?.to_datetime) {
		const formatted = formatDateTime(additionalFilters.to_datetime as string | Date);
		if (formatted) qs.to_datetime = formatted;
	}
	const responseData = await handlePaginatedRequest.call(
		this,
		`${SALES_DIALER_BASE}/campaigns`,
		qs,
		i,
	);
	return createExecutionData.call(this, responseData, i);
}

/**
 * Get a Sales Dialer campaign - GET /v2.1/sales_dialer/campaigns/{id}
 */
async function handleGetCampaign(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', i) as string;
	if (!campaignId) {
		throw new NodeOperationError(this.getNode(), 'Campaign ID is required', { itemIndex: i });
	}
	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`${SALES_DIALER_BASE}/campaigns/${campaignId}`,
		{},
		{},
	);
	return createExecutionData.call(this, responseData, i);
}

/**
 * List campaign contacts - GET /v2.1/sales_dialer/campaigns/contacts
 * Query: campaign_id (required for filtering)
 */
async function handleListCampaignContacts(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', i) as string;
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;
	if (!campaignId) {
		throw new NodeOperationError(this.getNode(), 'Campaign ID is required', { itemIndex: i });
	}
	const qs: IDataObject = { campaign_id: campaignId };
	if (additionalFilters?.status) qs.status = additionalFilters.status;
	if (additionalFilters?.progress) qs.progress = additionalFilters.progress;
	const responseData = await handlePaginatedRequest.call(
		this,
		`${SALES_DIALER_BASE}/campaigns/contacts`,
		qs,
		i,
	);
	return createExecutionData.call(this, responseData, i);
}

/**
 * Add contact to campaign - POST /v2.1/sales_dialer/campaigns/contact
 * Body: campaign_id, contact_id or phone_number (one required), name, email, birthday, occupation, address, custom_fields optional
 * @see https://developer.justcall.io/reference/sales_dialer_add_contact_to_campaign_v21
 */
async function handleAddContactToCampaign(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', i) as string;
	const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
	const contactId = this.getNodeParameter('contactId', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	if (!campaignId) {
		throw new NodeOperationError(this.getNode(), 'Campaign ID is required', { itemIndex: i });
	}
	if (!phoneNumber && !contactId) {
		throw new NodeOperationError(
			this.getNode(),
			'Either Phone Number or Contact ID must be provided',
			{ itemIndex: i },
		);
	}
	if (phoneNumber && contactId) {
		throw new NodeOperationError(
			this.getNode(),
			'Provide only one of Phone Number or Contact ID',
			{ itemIndex: i },
		);
	}
	const body: IDataObject = { campaign_id: campaignId };
	if (contactId) {
		body.contact_id = contactId;
	} else {
		body.phone_number = phoneNumber;
	}
	if (additionalFields.name) body.name = additionalFields.name;
	if (additionalFields.email) body.email = additionalFields.email;
	if (additionalFields.birthday) body.birthday = additionalFields.birthday;
	if (additionalFields.occupation) body.occupation = additionalFields.occupation;
	if (additionalFields.address) body.address = additionalFields.address;
	const customFieldsInput = additionalFields.custom_fields as
		| { customField?: Array<{ id: string; value: string }> }
		| undefined;
	if (customFieldsInput?.customField?.length) {
		body.custom_fields = customFieldsInput.customField;
	}
	const responseData = await justcallApiRequest.call(
		this,
		'POST',
		`${SALES_DIALER_BASE}/campaigns/contact`,
		body,
		{},
	);
	return createExecutionData.call(this, responseData, i);
}

/**
 * List all Sales Dialer contacts - GET /v2.1/sales_dialer/contacts
 * @see https://developer.justcall.io/reference/sd_list_contact_v21
 * Query params: email, phone_number, status (Active | DNCA), page, per_page
 */
async function handleListContacts(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;
	const qs: IDataObject = {};
	if (additionalFilters?.email) qs.email = additionalFilters.email;
	if (additionalFilters?.phone_number) qs.phone_number = additionalFilters.phone_number;
	if (additionalFilters?.status) qs.status = additionalFilters.status;
	const responseData = await handlePaginatedRequest.call(
		this,
		`${SALES_DIALER_BASE}/contacts`,
		qs,
		i,
	);
	return createExecutionData.call(this, responseData, i);
}

/**
 * Get a Sales Dialer contact - GET /v2.1/sales_dialer/contacts/{id}
 */
async function handleGetContact(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const contactId = this.getNodeParameter('contactId', i) as string;
	if (!contactId) {
		throw new NodeOperationError(this.getNode(), 'Contact ID is required', { itemIndex: i });
	}
	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`${SALES_DIALER_BASE}/contacts/${contactId}`,
		{},
		{},
	);
	return createExecutionData.call(this, responseData, i);
}
