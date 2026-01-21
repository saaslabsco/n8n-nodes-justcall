import { INodeProperties } from 'n8n-workflow';

export const triggerProperties: INodeProperties[] = [
	{
		displayName: 'Event',
		name: 'event',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Call Answered',
				value: 'call.answered',
				description: 'Trigger when a call is answered',
			},
			{
				name: 'Call Completed',
				value: 'call.completed',
				description: 'Trigger when a call is completed',
			},
			{
				name: 'Call Initiated',
				value: 'call.initiated',
				description: 'Trigger when a call is initiated',
			},
			{
				name: 'Call Missed',
				value: 'call.missed',
				description: 'Trigger when a call is missed',
			},
			{
				name: 'Call Updated',
				value: 'call.updated',
				description: 'Trigger when an call is updated',
			},
			{
				name: 'Incoming Call',
				value: 'call.incoming',
				description: 'Trigger when an incoming call is received',
			},
			{
				name: 'SMS Received',
				value: 'sms.received',
				description: 'Trigger when an SMS is received',
			},
			{
				name: 'SMS Sent',
				value: 'sms.sent',
				description: 'Trigger when an SMS is sent',
			},
			{
				name: 'Voicemail Received',
				value: 'voicemail.received',
				description: 'Trigger when a voicemail is received',
			},
		],
		default: 'call.completed',
		required: true,
		description: 'The event to listen to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				default: '',
				description: 'Only trigger for calls involving this specific agent',
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
				description: 'Only trigger for calls in this direction',
			},
		],
	},
];

