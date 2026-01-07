import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { justcallApiRequest, justcallApiRequestAllItems } from './GenericFunctions';

export class JustCall implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JustCall',
		name: 'justCall',
		icon: 'file:justcall.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with JustCall Calls API',
		defaults: {
			name: 'JustCall',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'justCallApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Call',
						value: 'call',
					},
				],
				default: 'call',
			},
			// Operations
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
						name: 'Get',
						value: 'get',
						description: 'Get a specific call',
						action: 'Get a call',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many calls',
						action: 'Get many calls',
					},
					{
						name: 'Initiate',
						value: 'initiate',
						description: 'Initiate an outbound call',
						action: 'Initiate a call',
					},
				],
				default: 'getMany',
			},

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
						displayName: 'Contact ID',
						name: 'contact_id',
						type: 'string',
						default: '',
						description: 'Filter calls by contact ID',
					},
					{
						displayName: 'Date From',
						name: 'date_from',
						type: 'dateTime',
						default: '',
						description: 'Start date for filtering calls (ISO 8601 format)',
					},
					{
						displayName: 'Date To',
						name: 'date_to',
						type: 'dateTime',
						default: '',
						description: 'End date for filtering calls (ISO 8601 format)',
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
						displayName: 'From Number',
						name: 'from_number',
						type: 'string',
						default: '',
						description: 'Filter by caller phone number',
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
						displayName: 'To Number',
						name: 'to_number',
						type: 'string',
						default: '',
						description: 'Filter by recipient phone number',
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
				description: 'The ID of the call to retrieve',
			},

			// ----------------------------------
			//         call:initiate
			// ----------------------------------
			{
				displayName: 'From',
				name: 'from',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['call'],
						operation: ['initiate'],
					},
				},
				default: '',
				description: 'The phone number to call from (must be a JustCall number)',
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['call'],
						operation: ['initiate'],
					},
				},
				default: '',
				description: 'The phone number to call to',
			},
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['call'],
						operation: ['initiate'],
					},
				},
				default: '',
				description: 'The ID of the agent initiating the call',
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
						operation: ['initiate'],
					},
				},
				options: [
					{
						displayName: 'Custom Data',
						name: 'custom_data',
						type: 'json',
						default: '{}',
						description: 'Custom data to attach to the call (JSON object)',
					},
					{
						displayName: 'Caller ID',
						name: 'caller_id',
						type: 'string',
						default: '',
						description: 'The caller ID to display',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'call') {
					// ----------------------------------
					//         call:getMany
					// ----------------------------------
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const additionalFilters = this.getNodeParameter('additionalFilters', i) as IDataObject;

						const qs: IDataObject = {};

						// Add filters
						if (additionalFilters.agent_id) {
							qs.agent_id = additionalFilters.agent_id;
						}
						if (additionalFilters.contact_id) {
							qs.contact_id = additionalFilters.contact_id;
						}
						if (additionalFilters.date_from) {
							qs.date_from = additionalFilters.date_from;
						}
						if (additionalFilters.date_to) {
							qs.date_to = additionalFilters.date_to;
						}
						if (additionalFilters.direction) {
							qs.direction = additionalFilters.direction;
						}
						if (additionalFilters.from_number) {
							qs.from_number = additionalFilters.from_number;
						}
						if (additionalFilters.status) {
							qs.status = additionalFilters.status;
						}
						if (additionalFilters.to_number) {
							qs.to_number = additionalFilters.to_number;
						}

						let responseData;
						if (returnAll) {
							responseData = await justcallApiRequestAllItems.call(
								this,
								'data',
								'GET',
								'/v2.1/calls',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i);
							qs.per_page = limit;
							qs.page = 1;
							const response = await justcallApiRequest.call(this, 'GET', '/v2.1/calls', {}, qs);
							responseData = response.data || [];
						}

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}

					// ----------------------------------
					//         call:get
					// ----------------------------------
					if (operation === 'get') {
						const callId = this.getNodeParameter('callId', i) as string;

						if (!callId) {
							throw new NodeOperationError(this.getNode(), 'Call ID is required', { itemIndex: i });
						}

						const responseData = await justcallApiRequest.call(
							this,
							'GET',
							`/v2.1/calls/${callId}`,
							{},
							{},
						);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}

					// ----------------------------------
					//         call:initiate
					// ----------------------------------
					if (operation === 'initiate') {
						const from = this.getNodeParameter('from', i) as string;
						const to = this.getNodeParameter('to', i) as string;
						const agentId = this.getNodeParameter('agentId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						if (!from || !to || !agentId) {
							throw new NodeOperationError(this.getNode(), 'From, To, and Agent ID are required', {
								itemIndex: i,
							});
						}

						const body: IDataObject = {
							from,
							to,
							agent_id: agentId,
						};

						if (additionalFields.custom_data) {
							try {
								body.custom_data = JSON.parse(additionalFields.custom_data as string);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), 'Custom data must be valid JSON', {
									itemIndex: i,
								});
							}
						}

						if (additionalFields.caller_id) {
							body.caller_id = additionalFields.caller_id;
						}

						const responseData = await justcallApiRequest.call(
							this,
							'POST',
							'/v2.1/voice-agents/calls',
							body,
							{},
						);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}
				}
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
