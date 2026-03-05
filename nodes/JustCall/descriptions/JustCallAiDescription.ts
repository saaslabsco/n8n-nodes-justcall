import { INodeProperties } from 'n8n-workflow';

export const justCallAiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['justCallAi'],
			},
		},
		options: [
			{
				name: 'Get Call AI Data',
				value: 'getCallAiData',
				description: 'Get AI-generated analysis for a specific call',
				action: 'Get call AI data',
			},
			{
				name: 'Get Meeting AI Data',
				value: 'getMeetingAiData',
				description: 'Get AI-generated analysis for a specific meeting instance',
				action: 'Get meeting AI data',
			},
			{
				name: 'List Calls AI Data',
				value: 'listCallsAiData',
				description: 'List AI-generated analysis for JustCall and Sales Dialer calls',
				action: 'List calls AI data',
			},
			{
				name: 'List Meetings AI Data',
				value: 'listMeetingsAiData',
				description: 'List AI-generated analysis for meeting instances',
				action: 'List meetings AI data',
			},
		],
		default: 'listCallsAiData',
	},
];

export const justCallAiFields: INodeProperties[] = [
	// ----------------------------------
	//         justCallAi:listCallsAiData
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['justCallAi'],
				operation: ['listCallsAiData'],
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
				resource: ['justCallAi'],
				operation: ['listCallsAiData'],
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
				resource: ['justCallAi'],
				operation: ['listCallsAiData'],
			},
		},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				default: '',
				description: 'Filter by agent ID',
			},
			{
				displayName: 'Fetch Action Items',
				name: 'fetch_action_items',
				type: 'boolean',
				default: false,
				description: 'Whether to include action items in the response',
			},
			{
				displayName: 'Fetch AI Insights',
				name: 'fetch_ai_insights',
				type: 'boolean',
				default: true,
				description: 'Whether to include AI-generated coaching insights',
			},
			{
				displayName: 'Fetch Smart Chapters',
				name: 'fetch_smart_chapters',
				type: 'boolean',
				default: false,
				description: 'Whether to include smart chapters in the response',
			},
			{
				displayName: 'Fetch Summary',
				name: 'fetch_summary',
				type: 'boolean',
				default: true,
				description: 'Whether to include summary in the response',
			},
			{
				displayName: 'Fetch Transcription',
				name: 'fetch_transcription',
				type: 'boolean',
				default: false,
				description: 'Whether to include transcription in the response',
			},
			{
				displayName: 'From Datetime',
				name: 'from_datetime',
				type: 'dateTime',
				default: '',
				description: 'Start datetime for filtering (yyyy-mm-dd hh:mm:ss, user timezone)',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Filter by phone number',
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'JustCall', value: 'justcall' },
					{ name: 'Sales Dialer', value: 'sales_dialer' },
				],
				default: 'justcall',
				description: 'Filter by platform',
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
	//         justCallAi:getCallAiData
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['justCallAi'],
				operation: ['getCallAiData'],
			},
		},
		default: '',
		description: 'The ID of the call (JustCall or Sales Dialer) to get AI data for',
	},
	{
		displayName: 'Additional Filters',
		name: 'additionalFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['justCallAi'],
				operation: ['getCallAiData'],
			},
		},
		options: [
			{
				displayName: 'Fetch Action Items',
				name: 'fetch_action_items',
				type: 'boolean',
				default: false,
				description: 'Whether to include action items in the response',
			},
			{
				displayName: 'Fetch AI Insights',
				name: 'fetch_ai_insights',
				type: 'boolean',
				default: true,
				description: 'Whether to include AI-generated coaching insights',
			},
			{
				displayName: 'Fetch Smart Chapters',
				name: 'fetch_smart_chapters',
				type: 'boolean',
				default: false,
				description: 'Whether to include smart chapters in the response',
			},
			{
				displayName: 'Fetch Summary',
				name: 'fetch_summary',
				type: 'boolean',
				default: true,
				description: 'Whether to include summary in the response',
			},
			{
				displayName: 'Fetch Transcription',
				name: 'fetch_transcription',
				type: 'boolean',
				default: false,
				description: 'Whether to include transcription in the response',
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'JustCall', value: 'justcall' },
					{ name: 'Sales Dialer', value: 'sales_dialer' },
				],
				default: 'justcall',
				description: 'Filter by platform',
			},
		],
	},

	// ----------------------------------
	//         justCallAi:listMeetingsAiData
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['justCallAi'],
				operation: ['listMeetingsAiData'],
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
				resource: ['justCallAi'],
				operation: ['listMeetingsAiData'],
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
				resource: ['justCallAi'],
				operation: ['listMeetingsAiData'],
			},
		},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				default: '',
				description: 'Filter by agent ID',
			},
			{
				displayName: 'Fetch AI Insights',
				name: 'fetch_ai_insights',
				type: 'boolean',
				default: true,
				description: 'Whether to include AI-generated coaching insights',
			},
			{
				displayName: 'Fetch Smart Chapters',
				name: 'fetch_smart_chapters',
				type: 'boolean',
				default: false,
				description: 'Whether to include smart chapters in the response',
			},
			{
				displayName: 'Fetch Summary',
				name: 'fetch_summary',
				type: 'boolean',
				default: true,
				description: 'Whether to include summary in the response',
			},
			{
				displayName: 'Fetch Transcription',
				name: 'fetch_transcription',
				type: 'boolean',
				default: false,
				description: 'Whether to include transcription in the response',
			},
			{
				displayName: 'From Datetime',
				name: 'from_datetime',
				type: 'dateTime',
				default: '',
				description: 'Start datetime for filtering (yyyy-mm-dd hh:mm:ss, user timezone)',
			},
			{
				displayName: 'Meeting ID',
				name: 'meeting_id',
				type: 'string',
				default: '',
				description: 'Filter by meeting ID (for recurring meetings with multiple instances)',
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'JustCall', value: 'justcall' },
					{ name: 'Sales Dialer', value: 'sales_dialer' },
				],
				default: 'justcall',
				description: 'Filter by platform',
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
	//         justCallAi:getMeetingAiData
	// ----------------------------------
	{
		displayName: 'Meeting Instance SID',
		name: 'instanceSid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['justCallAi'],
				operation: ['getMeetingAiData'],
			},
		},
		default: '',
		description: 'The instance SID of the meeting to get AI data for',
	},
	{
		displayName: 'Additional Filters',
		name: 'additionalFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['justCallAi'],
				operation: ['getMeetingAiData'],
			},
		},
		options: [
			{
				displayName: 'Fetch AI Insights',
				name: 'fetch_ai_insights',
				type: 'boolean',
				default: true,
				description: 'Whether to include AI-generated coaching insights',
			},
			{
				displayName: 'Fetch Smart Chapters',
				name: 'fetch_smart_chapters',
				type: 'boolean',
				default: false,
				description: 'Whether to include smart chapters in the response',
			},
			{
				displayName: 'Fetch Summary',
				name: 'fetch_summary',
				type: 'boolean',
				default: true,
				description: 'Whether to include summary in the response',
			},
			{
				displayName: 'Fetch Transcription',
				name: 'fetch_transcription',
				type: 'boolean',
				default: false,
				description: 'Whether to include transcription in the response',
			},
		],
	},
];
