import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

import { justcallApiRequest } from './GenericFunctions';

export class JustCallTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JustCall Trigger',
		name: 'justCallTrigger',
		icon: 'file:justcall.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when JustCall events occur',
		defaults: {
			name: 'JustCall Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'justCallApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
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
						name: 'Incoming Call',
						value: 'call.incoming',
						description: 'Trigger when an incoming call is received',
					},
					{
						name: 'Voicemail Received',
						value: 'voicemail.received',
						description: 'Trigger when a voicemail is received',
					},
					{
						name: '*',
						value: '*',
						description: 'Trigger on all call events',
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
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				try {
					// Check if webhook already exists in JustCall
					const webhooks = await justcallApiRequest.call(
						this,
						'GET',
						'/v2.1/webhooks',
						{},
						{},
					);

					console.log('Checking existing webhooks:', JSON.stringify(webhooks, null, 2));

					if (webhooks.data && Array.isArray(webhooks.data)) {
						for (const webhook of webhooks.data) {
							if (webhook.webhook_url === webhookUrl && webhook.type === event) {
								console.log('Webhook already exists!');
								return true;
							}
						}
					}
				} catch (error) {
					console.log('Could not check existing webhooks:', error);
					// If endpoint doesn't exist or returns error, assume webhook doesn't exist
					return false;
				}

				console.log('Webhook does not exist yet');
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				const body: IDataObject = {
					webhook_url: webhookUrl,
					type: event,
				};


				try {
					const response = await justcallApiRequest.call(this, 'POST', '/v2.1/webhooks', body, {});
					console.log('JustCall webhook created successfully:', JSON.stringify(response, null, 2));
					return true;
				} catch (error) {
					console.error('JustCall webhook creation failed:', error);
					console.error('Error details:', error instanceof Error ? error.message : String(error));
					
					// For now, return true to allow manual webhook setup
					console.log('⚠️  Automatic webhook creation failed. Please create the webhook manually in JustCall dashboard.');
					console.log('   Webhook URL:', webhookUrl);
					console.log('   Event Type:', event);
					
					// Return true to allow the workflow to activate (user will create webhook manually)
					return true;
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				try {
					// Get all webhooks to find the ID
					const webhooks = await justcallApiRequest.call(
						this,
						'GET',
						'/v2.1/webhooks',
						{},
						{},
					);

					if (webhooks.data && Array.isArray(webhooks.data)) {
						for (const webhook of webhooks.data) {
							if (webhook.url === webhookUrl && webhook.event === event) {
								// Delete the webhook
								await justcallApiRequest.call(
									this,
									'DELETE',
									`/v2.1/webhooks/${webhook.id}`,
									{},
									{},
								);
								return true;
							}
						}
					}
				} catch (error) {
					// If deletion fails, log but don't throw
					console.error('Failed to delete JustCall webhook:', error);
				}

				return false;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const event = this.getNodeParameter('event') as string;
		const additionalFields = this.getNodeParameter('additionalFields', {}) as IDataObject;
		
		// Get webhook payload - use n8n's getBodyData() method
		const bodyData = this.getBodyData();
		
		// Extract the raw payload
		let rawPayload: IDataObject = {};
		
		if (typeof bodyData === 'object' && bodyData !== null) {
			// If bodyData is already parsed, use it directly
			rawPayload = bodyData as IDataObject;
		}

		// Extract the event type from top level
		const webhookEvent = (rawPayload.type as string) || '';
		
		// Extract the actual call data from the nested 'data' property
		let callData: IDataObject = {};
		if (rawPayload.data && typeof rawPayload.data === 'object') {
			callData = rawPayload.data as IDataObject;
		}
		
		// Add event type and metadata to the call data for easier access
		const enrichedData: IDataObject = {
			...callData,
			event: webhookEvent,
			request_id: rawPayload.request_id,
			webhook_url: rawPayload.webhook_url,
			metadata: rawPayload.metadata,
		};

		// Filter based on event type (unless listening to all events)
		if (event !== '*' && webhookEvent !== event) {
			console.log(`Event mismatch: expected ${event}, got ${webhookEvent}`);
			return {
				workflowData: [],
			};
		}

		// Apply additional filters if specified
		if (additionalFields.agent_id) {
			const dataAgentId = callData.agent_id?.toString();
			const filterAgentId = additionalFields.agent_id.toString();
			if (dataAgentId !== filterAgentId) {
				console.log(`Agent ID mismatch: expected ${filterAgentId}, got ${dataAgentId}`);
				return {
					workflowData: [],
				};
			}
		}

		if (additionalFields.direction) {
			// Direction is in call_info.direction
			const callInfo = callData.call_info as IDataObject;
			const direction = callInfo?.direction?.toString().toLowerCase();
			const filterDirection = additionalFields.direction.toString().toLowerCase();
			
			// Match "Outgoing" to "outbound" and "Incoming" to "inbound"
			const normalizedDirection = direction === 'outgoing' ? 'outbound' : direction === 'incoming' ? 'inbound' : direction;
			
			if (normalizedDirection !== filterDirection) {
				console.log(`Direction mismatch: expected ${filterDirection}, got ${normalizedDirection}`);
				return {
					workflowData: [],
				};
			}
		}

		// Return the enriched data to trigger the workflow
		return {
			workflowData: [this.helpers.returnJsonArray(enrichedData)],
		};
	}
}

