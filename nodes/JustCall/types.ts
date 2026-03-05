import { INodeProperties } from 'n8n-workflow';

export type Resource =
	| 'call'
	| 'sms'
	| 'contact'
	| 'phoneNumber'
	| 'aiVoiceAgent'
	| 'salesDialer'
	| 'justCallAi';

export type CallOperation = 'get' | 'getMany' | 'update';
export type AiVoiceAgentOperation = 'listAgents' | 'initiateCall';
export type SmsOperation = 'send' | 'get' | 'getMany';
export type ContactOperation = 'create' | 'delete' | 'get' | 'getMany' | 'update';
export type PhoneNumberOperation = 'getMany' | 'get' | 'detectIncoming';

export interface ResourceDescription {
	resource: Resource;
	operations: INodeProperties[];
	fields: INodeProperties[];
}

