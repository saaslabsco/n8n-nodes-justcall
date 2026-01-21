import { INodeProperties } from 'n8n-workflow';

export const phoneNumberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get all phone numbers',
				action: 'Get all phone numbers',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific phone number',
				action: 'Get a phone number',
			}
		],
		default: 'getMany',
	},
];

export const phoneNumberFields: INodeProperties[] = [
	// ----------------------------------
	//         phoneNumber:get
	// ----------------------------------
	{
		displayName: 'Phone Number ID',
		name: 'phoneNumberId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the phone number to retrieve',
	},

	// ----------------------------------
	//         phoneNumber:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
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
				resource: ['phoneNumber'],
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

	// ----------------------------------
	//         phoneNumber:detectIncoming
	// ----------------------------------
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['detectIncoming'],
			},
		},
		default: '',
		description: 'The phone number to detect',
	},
];

