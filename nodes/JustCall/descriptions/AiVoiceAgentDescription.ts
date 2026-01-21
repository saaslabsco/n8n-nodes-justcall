import { INodeProperties } from 'n8n-workflow';

export const aiVoiceAgentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['aiVoiceAgent'],
			},
		},
		options: [
			{
				name: 'List Agents',
				value: 'listAgents',
				description: 'List all AI voice agents',
				action: 'List all AI voice agents',
			},
			{
				name: 'Initiate Call',
				value: 'initiateCall',
				description: 'Initiate a call with an AI voice agent',
				action: 'Initiate a call with AI voice agent',
			},
		],
		default: 'listAgents',
	},
];

export const aiVoiceAgentFields: INodeProperties[] = [
	// ----------------------------------
	//         aiVoiceAgent:listAgents
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['aiVoiceAgent'],
				operation: ['listAgents'],
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
				resource: ['aiVoiceAgent'],
				operation: ['listAgents'],
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
	//         aiVoiceAgent:initiateCall
	// ----------------------------------
	{
		displayName: 'AI Agent ID',
		name: 'aiAgentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['aiVoiceAgent'],
				operation: ['initiateCall'],
			},
		},
		default: '',
		description: 'The ID of the AI voice agent to use for the call',
	},
	{
		displayName: 'Contact Number',
		name: 'contactNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['aiVoiceAgent'],
				operation: ['initiateCall'],
			},
		},
		default: '',
		description: 'The phone number of the contact to call',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['aiVoiceAgent'],
				operation: ['initiateCall'],
			},
		},
		options: [
			{
				displayName: 'Dynamic Variables',
				name: 'dynamic_variables',
				type: 'json',
				default: '{}',
				description: 'Dynamic variables to customize what the AI says or does during the conversation (e.g., greeting the recipient by name or referencing a product)',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
			},
			{
				displayName: 'Has Consent',
				name: 'has_consent',
				type: 'boolean',
				default: false,
				description: 'Whether the contact has given consent for the call',
			},
		],
	},
];

