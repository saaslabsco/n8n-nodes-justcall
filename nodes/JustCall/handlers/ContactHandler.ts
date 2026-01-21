import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { justcallApiRequest } from '../GenericFunctions';
import { handlePaginatedRequest, createExecutionData, parseJsonField, parseTags } from '../utils/helpers';

export async function handleContactOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return await handleCreateContact.call(this, i);
		case 'update':
			return await handleUpdateContact.call(this, i);
		case 'delete':
			return await handleDeleteContact.call(this, i);
		case 'get':
			return await handleGetContact.call(this, i);
		case 'getMany':
			return await handleGetManyContacts.call(this, i);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
				itemIndex: i,
			});
	}
}

async function handleCreateContact(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	if (!phoneNumber) {
		throw new NodeOperationError(this.getNode(), 'Phone Number is required', { itemIndex: i });
	}

	const body: IDataObject = {
		contact_number: phoneNumber,
	};

	if (additionalFields.first_name) {
		body.first_name = additionalFields.first_name;
	}
	if (additionalFields.last_name) {
		body.last_name = additionalFields.last_name;
	}
	if (additionalFields.email) {
		body.email = additionalFields.email;
	}
	if (additionalFields.company) {
		body.company = additionalFields.company;
	}
	const tags = parseTags(additionalFields.tags as string | undefined);
	if (tags) {
		body.tags = tags;
	}

	if (additionalFields.custom_fields) {
		try {
			const customFields = parseJsonField(
				additionalFields.custom_fields as string | undefined,
				'Custom fields',
			);
			if (customFields !== undefined) {
				body.custom_fields = customFields;
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				error instanceof Error ? error.message : 'Custom fields must be valid JSON',
				{ itemIndex: i },
			);
		}
	}

	const responseData = await justcallApiRequest.call(
		this,
		'POST',
		'/v2.1/contacts',
		body,
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

async function handleUpdateContact(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const contactId = this.getNodeParameter('contactId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const body: IDataObject = {};

	// At least one identifier is required: id or contact_number
	if (contactId) {
		body.id = contactId;
	}
	if (updateFields.contact_number) {
		body.contact_number = updateFields.contact_number;
	} else if (updateFields.phone_number) {
		// Support phone_number as alias for contact_number
		body.contact_number = updateFields.phone_number;
	}

	if (!body.id && !body.contact_number) {
		throw new NodeOperationError(
			this.getNode(),
			'Either Contact ID or Contact Number must be provided to identify the contact',
			{ itemIndex: i },
		);
	}

	if (updateFields.first_name) {
		body.first_name = updateFields.first_name;
	}
	if (updateFields.last_name) {
		body.last_name = updateFields.last_name;
	}
	if (updateFields.email) {
		body.email = updateFields.email;
	}
	if (updateFields.company) {
		body.company = updateFields.company;
	}
	const tags = parseTags(updateFields.tags as string | undefined);
	if (tags) {
		body.tags = tags;
	}

	if (updateFields.custom_fields) {
		try {
			const customFields = parseJsonField(
				updateFields.custom_fields as string | undefined,
				'Custom fields',
			);
			if (customFields !== undefined) {
				body.custom_fields = customFields;
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				error instanceof Error ? error.message : 'Custom fields must be valid JSON',
				{ itemIndex: i },
			);
		}
	}

	const responseData = await justcallApiRequest.call(
		this,
		'PUT',
		'/v2.1/contacts',
		body,
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

async function handleDeleteContact(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const contactId = this.getNodeParameter('contactId', i) as string;

	if (!contactId) {
		throw new NodeOperationError(this.getNode(), 'Contact ID is required', { itemIndex: i });
	}

	await justcallApiRequest.call(this, 'DELETE', `/v2.1/contacts/${contactId}`, {}, {});

	return createExecutionData.call(this, { success: true }, i);
}

async function handleGetContact(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const contactId = this.getNodeParameter('contactId', i) as string;

	if (!contactId) {
		throw new NodeOperationError(this.getNode(), 'Contact ID is required', { itemIndex: i });
	}

	const responseData = await justcallApiRequest.call(
		this,
		'GET',
		`/v2.1/contacts/${contactId}`,
		{},
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

async function handleGetManyContacts(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFilters.contact_number) {
		qs.contact_number = additionalFilters.contact_number;
	}
	if (additionalFilters.first_name) {
		qs.first_name = additionalFilters.first_name;
	}
	if (additionalFilters.last_name) {
		qs.last_name = additionalFilters.last_name;
	}
	if (additionalFilters.order) {
		qs.order = additionalFilters.order;
	}

	const responseData = await handlePaginatedRequest.call(this, '/v2.1/contacts', qs, i);
	return createExecutionData.call(this, responseData, i);
}

