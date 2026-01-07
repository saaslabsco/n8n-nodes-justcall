import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class JustCallApi implements ICredentialType {
	name = 'justCallApi';
	displayName = 'JustCall API';
	documentationUrl = 'https://developer.justcall.io/reference/authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API Key for JustCall API authentication',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API Secret for JustCall API authentication',
		},
	];
}
