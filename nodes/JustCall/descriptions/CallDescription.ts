import { INodeProperties } from 'n8n-workflow';

export const callOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['call'],
			},
		},
		options: [
			{
				name: 'Download Call Recording',
				value: 'downloadRecording',
				description: 'Download the recording of a completed call',
				action: 'Download call recording',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific call',
				action: 'Get a call',
			},
			{
				name: 'Get Call Journey',
				value: 'getJourney',
				description: 'Get journey details of a completed call (available only after call has ended)',
				action: 'Get call journey',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many calls',
				action: 'Get many calls',
			},
			{
				name: 'Get Voice Agent Data',
				value: 'getVoiceAgentData',
				description: 'Get voice agent insights and metadata for a completed call',
				action: 'Get voice agent data',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a call (notes, disposition, rating)',
				action: 'Update a call',
			},
		],
		default: 'getMany',
	},
];

export const callFields: INodeProperties[] = [
	// ----------------------------------
	//         call:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['call'],
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
				resource: ['call'],
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
				resource: ['call'],
				operation: ['getMany'],
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
				displayName: 'Contact Number',
				name: 'contact_number',
				type: 'string',
				default: '',
				description: 'Filter calls by contact phone number',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{
						name: 'Inbound',
						value: 'inbound',
					},
					{
						name: 'Outbound',
						value: 'outbound',
					},
				],
				default: 'inbound',
				description: 'Filter by call direction',
			},
			{
				displayName: 'Fetch AI Data',
				name: 'fetch_ai_data',
				type: 'boolean',
				default: false,
				description: 'Whether to fetch AI data (transcription, summary, etc.)',
			},
			{
				displayName: 'From Datetime',
				name: 'from_datetime',
				type: 'dateTime',
				default: '',
				description: 'Start datetime for filtering calls (format: yyyy-mm-dd hh:mm:ss, in user timezone)',
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
					{
						name: 'Ascending',
						value: 'ASC',
					},
					{
						name: 'Descending',
						value: 'DESC',
					},
				],
				default: 'ASC',
				description: 'Sort order of results',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Filter by JustCall or Sales Dialer phone number',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Answered',
						value: 'answered',
					},
					{
						name: 'Busy',
						value: 'busy',
					},
					{
						name: 'Canceled',
						value: 'canceled',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
					{
						name: 'No Answer',
						value: 'no-answer',
					},
				],
				default: 'completed',
				description: 'Filter by call status',
			},
			{
				displayName: 'To Datetime',
				name: 'to_datetime',
				type: 'dateTime',
				default: '',
				description: 'End datetime for filtering calls (format: yyyy-mm-dd hh:mm:ss, in user timezone)',
			},
		],
	},

	// ----------------------------------
	//         call:get
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the call to retrieve. You can use expressions like {{$JSON.call_id}} to get the call ID from a trigger node.',
	},

	// ----------------------------------
	//         call:getJourney
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['getJourney'],
			},
		},
		default: '',
		description: 'The ID of the completed call. Journey data is generated only after the call has ended.',
	},

	// ----------------------------------
	//         call:getVoiceAgentData
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['getVoiceAgentData'],
			},
		},
		default: '',
		description: 'The ID of the completed call. Voice agent data is processed after the call ends.',
	},

	// ----------------------------------
	//         call:downloadRecording
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['downloadRecording'],
			},
		},
		default: '',
		description: 'The ID of the completed call. Recordings are available only after the call has ended.',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['downloadRecording'],
			},
		},
		description: 'Name of the binary property to which to write the recording file',
	},

	// ----------------------------------
	//         call:update
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the call to update',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Text notes about the conversation',
			},
			{
				displayName: 'Disposition',
				name: 'disposition',
				type: 'string',
				default: '',
				description: 'The outcome of the call (e.g., "Interested", "No Answer")',
			},
			{
				displayName: 'Rating',
				name: 'rating',
				type: 'string',
				default: '',
				description: 'A rating for the call (can be numerical or string-based)',
			},
		],
	},
];

