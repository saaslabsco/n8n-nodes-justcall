import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// Import property descriptions
import { callOperations, callFields } from './descriptions/CallDescription';
import { smsOperations, smsFields } from './descriptions/SmsDescription';
import { contactOperations, contactFields } from './descriptions/ContactDescription';
import { phoneNumberOperations, phoneNumberFields } from './descriptions/PhoneNumberDescription';
import {
	aiVoiceAgentOperations,
	aiVoiceAgentFields,
} from './descriptions/AiVoiceAgentDescription';
import {
	salesDialerOperations,
	salesDialerFields,
} from './descriptions/SalesDialerDescription';
import {
	justCallAiOperations,
	justCallAiFields,
} from './descriptions/JustCallAiDescription';

// Import operation handlers
import { handleCallOperation } from './handlers/CallHandler';
import { handleSmsOperation } from './handlers/SmsHandler';
import { handleContactOperation } from './handlers/ContactHandler';
import { handlePhoneNumberOperation } from './handlers/PhoneNumberHandler';
import { handleAiVoiceAgentOperation } from './handlers/AiVoiceAgentHandler';
import { handleSalesDialerOperation } from './handlers/SalesDialerHandler';
import { handleJustCallAiOperation } from './handlers/JustCallAiHandler';

import type { Resource } from './types';

export class JustCall implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JustCall',
		name: 'justCall',
		icon: 'file:justcall.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Interact with JustCall API (Calls, SMS, Contacts, Phone Numbers, AI Voice Agents, Sales Dialer, JustCall AI)',
		defaults: {
			name: 'JustCall',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'justCallApi',
				required: true,
			},
		],
		properties: [
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'AI Voice Agent',
						value: 'aiVoiceAgent',
					},
					{
						name: 'Call',
						value: 'call',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'JustCall AI',
						value: 'justCallAi',
					},
					{
						name: 'Phone Number',
						value: 'phoneNumber',
					},
					{
						name: 'Sales Dialer',
						value: 'salesDialer',
					},
					{
						name: 'SMS',
						value: 'sms',
					},
				],
				default: 'call',
			},
			// Operations and fields for each resource
			...callOperations,
			...callFields,
			...smsOperations,
			...smsFields,
			...contactOperations,
			...contactFields,
			...phoneNumberOperations,
			...phoneNumberFields,
			...aiVoiceAgentOperations,
			...aiVoiceAgentFields,
			...salesDialerOperations,
			...salesDialerFields,
			...justCallAiOperations,
			...justCallAiFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as Resource;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let executionData: INodeExecutionData[];

				switch (resource) {
					case 'call':
						executionData = await handleCallOperation.call(this, operation, i);
						break;
					case 'sms':
						executionData = await handleSmsOperation.call(this, operation, i);
						break;
					case 'contact':
						executionData = await handleContactOperation.call(this, operation, i);
						break;
					case 'phoneNumber':
						executionData = await handlePhoneNumberOperation.call(this, operation, i);
						break;
					case 'aiVoiceAgent':
						executionData = await handleAiVoiceAgentOperation.call(this, operation, i);
						break;
					case 'salesDialer':
						executionData = await handleSalesDialerOperation.call(this, operation, i);
						break;
					case 'justCallAi':
						executionData = await handleJustCallAiOperation.call(this, operation, i);
						break;
					default:
						throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
							itemIndex: i,
						});
				}

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'An error occurred',
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
