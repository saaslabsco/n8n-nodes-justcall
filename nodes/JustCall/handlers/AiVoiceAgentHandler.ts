import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { justcallApiRequest } from '../GenericFunctions';
import { handlePaginatedRequest, createExecutionData, parseJsonField } from '../utils/helpers';

export async function handleAiVoiceAgentOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listAgents':
			return await handleListAgents.call(this, i);
		case 'initiateCall':
			return await handleInitiateAiCall.call(this, i);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
				itemIndex: i,
			});
	}
}

async function handleListAgents(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const responseData = await handlePaginatedRequest.call(this, '/v2.1/voice-agents/list', {}, i);
	return createExecutionData.call(this, responseData, i);
}

async function handleInitiateAiCall(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const aiAgentId = this.getNodeParameter('aiAgentId', i) as string;
	const contactNumber = this.getNodeParameter('contactNumber', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	if (!aiAgentId || !contactNumber) {
		throw new NodeOperationError(
			this.getNode(),
			'AI Agent ID and Contact Number are required',
			{
				itemIndex: i,
			},
		);
	}

	const body: IDataObject = {
		ai_agent_id: aiAgentId,
		contact_number: contactNumber,
	};

	if (additionalFields.dynamic_variables) {
		try {
			const dynamicVariables = parseJsonField(
				additionalFields.dynamic_variables as string | undefined,
				'Dynamic variables',
			);
			if (dynamicVariables !== undefined) {
				body.dynamic_variables = dynamicVariables;
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				error instanceof Error ? error.message : 'Dynamic variables must be valid JSON',
				{ itemIndex: i },
			);
		}
	}

	if (additionalFields.has_consent !== undefined) {
		body.has_consent = additionalFields.has_consent;
	}

	const responseData = await justcallApiRequest.call(
		this,
		'POST',
		'/v2.1/voice-agents/calls',
		body,
		{},
	);

	return createExecutionData.call(this, responseData, i);
}

