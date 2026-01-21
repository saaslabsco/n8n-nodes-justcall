import { INodeProperties } from 'n8n-workflow';

export const smsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sms'],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				description: 'Send an SMS or MMS',
				action: 'Send an SMS',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific SMS',
				action: 'Get an SMS',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many SMS messages',
				action: 'Get many SMS',
			},
		],
		default: 'send',
	},
];

export const smsFields: INodeProperties[] = [
	// ----------------------------------
	//         sms:send
	// ----------------------------------
	{
		displayName: 'JustCall Number',
		name: 'justcallNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send'],
			},
		},
		default: '',
		description: 'The JustCall phone number to send SMS from (in E.164 format)',
	},
	{
		displayName: 'Contact Number',
		name: 'contactNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send'],
			},
		},
		default: '',
		description: 'The recipient phone number (in E.164 format)',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send'],
			},
		},
		default: '',
		description: 'The SMS message text',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Media URL',
				name: 'media_url',
				type: 'string',
				default: '',
				description: 'URL of media file for MMS (image, video, etc.)',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Contact ID to associate with the SMS',
			},
		],
	},

	// ----------------------------------
	//         sms:get
	// ----------------------------------
	{
		displayName: 'SMS ID',
		name: 'smsId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the SMS to retrieve',
	},

	// ----------------------------------
	//         sms:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['getMany'],
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
				resource: ['sms'],
				operation: ['getMany'],
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
				resource: ['sms'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Filter SMS by contact ID',
			},
			{
				displayName: 'Date From',
				name: 'date_from',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering SMS (format: yyyy-mm-dd hh:mm:ss)',
			},
			{
				displayName: 'Date To',
				name: 'date_to',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering SMS (format: yyyy-mm-dd hh:mm:ss)',
			},
			{
				displayName: 'From Number',
				name: 'from_number',
				type: 'string',
				default: '',
				description: 'Filter by sender phone number',
			},
			{
				displayName: 'To Number',
				name: 'to_number',
				type: 'string',
				default: '',
				description: 'Filter by recipient phone number',
			},
		],
	},
];

