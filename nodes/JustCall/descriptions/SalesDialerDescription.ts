import { INodeProperties } from 'n8n-workflow';

export const salesDialerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['salesDialer'],
			},
		},
		options: [
			{
				name: 'Add Contact to Campaign',
				value: 'addContactToCampaign',
				description: 'Add a contact to a Sales Dialer campaign',
				action: 'Add contact to a campaign',
			},
			{
				name: 'Get a Call',
				value: 'getCall',
				description: 'Get a specific Sales Dialer call',
				action: 'Get a call',
			},
			{
				name: 'Get a Campaign',
				value: 'getCampaign',
				description: 'Get a specific Sales Dialer campaign',
				action: 'Get a campaign',
			},
			{
				name: 'Get a Contact',
				value: 'getContact',
				description: 'Get a specific Sales Dialer contact',
				action: 'Get a contact',
			},
			{
				name: 'List All Calls',
				value: 'listCalls',
				description: 'List all Sales Dialer calls',
				action: 'List all calls',
			},
			{
				name: 'List All Campaigns',
				value: 'listCampaigns',
				description: 'List all Sales Dialer campaigns',
				action: 'List all campaigns',
			},
			{
				name: 'List All Contacts',
				value: 'listContacts',
				description: 'List all Sales Dialer contacts',
				action: 'List all contacts',
			},
			{
				name: 'List Campaign Contacts',
				value: 'listCampaignContacts',
				description: 'List contacts in a Sales Dialer campaign',
				action: 'List campaign contacts',
			},
		],
		default: 'listCalls',
	},
];

export const salesDialerFields: INodeProperties[] = [
	// ----------------------------------
	//         salesDialer:listCalls
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCalls'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCalls'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Filters',
		name: 'additionalFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCalls'],
			},
		},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				default: '',
				description: 'Filter calls by agent ID',
			},
			{
				displayName: 'Call Type',
				name: 'call_type',
				type: 'options',
				options: [
					{ name: 'Inbound', value: 'inbound' },
					{ name: 'Outbound', value: 'outbound' },
				],
				default: 'inbound',
				description: 'Filter calls by direction (inbound or outbound)',
			},
			{
				displayName: 'Campaign ID',
				name: 'campaign_id',
				type: 'string',
				default: '',
				description: 'Filter calls by campaign ID',
			},
			{
				displayName: 'Contact Number',
				name: 'contact_number',
				type: 'string',
				default: '',
				description: 'Filter calls by contact phone number',
			},
			{
				displayName: 'Fetch AI Data',
				name: 'fetch_ai_data',
				type: 'boolean',
				default: false,
				description: 'Whether to include AI-generated call data in the response',
			},
			{
				displayName: 'From Datetime',
				name: 'from_datetime',
				type: 'dateTime',
				default: '',
				description: 'Start datetime for filtering (yyyy-mm-dd hh:mm:ss, user timezone)',
			},
			{
				displayName: 'Last Call ID Fetched',
				name: 'last_call_id_fetched',
				type: 'string',
				default: '',
				description: 'For duplicate-safe pagination when using next page link pattern',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'ASC' },
					{ name: 'Descending', value: 'DESC' },
				],
				default: 'ASC',
				description: 'Sort order of results',
			},
			{
				displayName: 'Sales Dialer Number',
				name: 'sales_dialer_number',
				type: 'string',
				default: '',
				description: 'Filter calls by Sales Dialer phone number',
			},
			{
				displayName: 'To Datetime',
				name: 'to_datetime',
				type: 'dateTime',
				default: '',
				description: 'End datetime for filtering (yyyy-mm-dd hh:mm:ss, user timezone)',
			},
		],
	},

	// ----------------------------------
	//         salesDialer:getCall
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['getCall'],
			},
		},
		default: '',
		description: 'The ID of the Sales Dialer call to retrieve',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['getCall'],
			},
		},
		options: [
			{
				displayName: 'Fetch AI Data',
				name: 'fetch_ai_data',
				type: 'boolean',
				default: false,
				description: 'Whether to include AI-generated data in the response',
			},
		],
	},

	// ----------------------------------
	//         salesDialer:listCampaigns
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCampaigns'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCampaigns'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Filters',
		name: 'additionalFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCampaigns'],
			},
		},
		options: [
			{
				displayName: 'Contact Number',
				name: 'contact_number',
				type: 'string',
				default: '',
				description: 'Filter campaigns by contact phone number',
			},
			{
				displayName: 'From Datetime',
				name: 'from_datetime',
				type: 'dateTime',
				default: '',
				description: 'Start datetime for filtering (yyyy-mm-dd hh:mm:ss, user timezone)',
			},
			{
				displayName: 'Sales Dialer Number',
				name: 'sales_dialer_number',
				type: 'string',
				default: '',
				description: 'Filter campaigns by Sales Dialer phone number',
			},
			{
				displayName: 'To Datetime',
				name: 'to_datetime',
				type: 'dateTime',
				default: '',
				description: 'End datetime for filtering (yyyy-mm-dd hh:mm:ss, user timezone)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'PowerDial', value: 'PowerDial' },
					{ name: 'Dynamic', value: 'Dynamic' },
					{ name: 'Predictive', value: 'Predictive' },
				],
				default: 'PowerDial',
				description: 'Filter by campaign type',
			},
		],
	},

	// ----------------------------------
	//         salesDialer:getCampaign
	// ----------------------------------
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['getCampaign'],
			},
		},
		default: '',
		description: 'The ID of the Sales Dialer campaign to retrieve',
	},

	// ----------------------------------
	//         salesDialer:listCampaignContacts
	// ----------------------------------
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCampaignContacts'],
			},
		},
		default: '',
		description: 'The ID of the campaign to list contacts from',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCampaignContacts'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCampaignContacts'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Filters',
		name: 'additionalFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listCampaignContacts'],
			},
		},
		options: [
			{
				displayName: 'Progress',
				name: 'progress',
				type: 'options',
				options: [
					{ name: 'Dialed', value: 'Dialed' },
					{ name: 'Skipped', value: 'Skipped' },
					{ name: 'Undialed', value: 'Undialed' },
				],
				default: 'Undialed',
				description: 'Filter by contact progress in the campaign',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'Active' },
					{ name: 'DNCA', value: 'DNCA' },
					{ name: 'Invalid', value: 'Invalid' },
				],
				default: 'Active',
				description: 'Filter by contact status',
			},
		],
	},

	// ----------------------------------
	//         salesDialer:addContactToCampaign
	// ----------------------------------
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['addContactToCampaign'],
			},
		},
		default: '',
		description: 'The ID of the campaign to add the contact to',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['addContactToCampaign'],
			},
		},
		default: '',
		description: 'Phone number of the contact. Provide either this or Contact ID. Creates or updates contact if number exists.',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['addContactToCampaign'],
			},
		},
		default: '',
		description: 'The ID of the contact to add. Provide either this or Phone Number.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['addContactToCampaign'],
			},
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Address of the contact',
			},
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'string',
				default: '',
				description: 'Birth date in yyyy-mm-dd format',
			},
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Custom fields as array of objects with ID and value',
				options: [
					{
						displayName: 'Custom Field',
						name: 'customField',
						values: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'Custom field ID',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Custom field value',
							},
						],
					},
				],
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email of the contact',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the contact',
			},
			{
				displayName: 'Occupation',
				name: 'occupation',
				type: 'string',
				default: '',
				description: 'Occupation of the contact',
			},
		],
	},

	// ----------------------------------
	//         salesDialer:listContacts
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listContacts'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listContacts'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Filters',
		name: 'additionalFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['listContacts'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Filter contacts by email',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Filter contacts by phone number',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'Active' },
					{ name: 'DNCA', value: 'DNCA' },
				],
				default: 'Active',
				description: 'Filter by contact status (Active or DNCA)',
			},
		],
	},

	// ----------------------------------
	//         salesDialer:getContact
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesDialer'],
				operation: ['getContact'],
			},
		},
		default: '',
		description: 'The ID of the Sales Dialer contact to retrieve',
	},
];
