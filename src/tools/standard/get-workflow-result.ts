import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi from 'linkedapi-node';

import { getWorkflowResultSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getGetWorkflowResultTool = (): Tool => ({
  name: 'get_workflow_result',
  description:
    'CONTINUE LISTENING TO BACKGROUND WORKFLOW - THIS IS NORMAL OPERATION! Background workflows are OPTIMAL BEHAVIOR for Linked API operations and keep the MCP client responsive. When a workflow runs in the background, this tool should be used with the provided workflowId and operationName parameters to continue listening for updates. The workflow continues processing in the background while you wait. This is the STANDARD way Linked API works - background processing provides optimal user experience!',
  inputSchema: {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        description: 'The workflow ID provided in the background workflow status message',
      },
      operationName: {
        type: 'string',
        description:
          'Optional function name for proper type restoration (provided in background workflow status if available)',
      },
    },
    required: ['workflowId', 'operationName'],
  },
});

const getWorkflowResult = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = getWorkflowResultSchema.parse(args);
  const operation = linkedapi.operations.find(
    (operation) => operation.operationName === params.operationName,
  );
  if (!operation) {
    throw new Error(`Operation ${params.operationName} not found`);
  }
  const result = await executeWithProgress(
    operation.operationName,
    progressCallback,
    operation,
    undefined,
    params.workflowId,
  );
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const getWorkflowResultTool: ToolHandler = {
  tool: getGetWorkflowResultTool(),
  handler: getWorkflowResult,
};
