import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { OPERATION_NAME, TMappedResponse } from 'linkedapi-node';
import z from 'zod';

import { executeWithProgress } from '../utils/execute-with-progress.js';
import { LinkedApiTool } from '../utils/linked-api-tool.js';

interface IGetWorkflowResultParams {
  workflowId: string;
  operationName: string;
}

export class GetWorkflowResultTool extends LinkedApiTool<IGetWorkflowResultParams, unknown> {
  public readonly name = 'get_workflow_result';
  protected readonly schema = z.object({
    workflowId: z.string(),
    operationName: z.enum(Object.values(OPERATION_NAME)),
  });

  public override async execute(
    linkedapi: LinkedApi,
    args: IGetWorkflowResultParams,
    progressToken?: string | number,
  ): Promise<TMappedResponse<unknown>> {
    const operation = linkedapi.operations.find(
      (operation) => operation.operationName === args.operationName,
    )!;
    return await executeWithProgress(this.progressCallback, operation, {
      workflowId: args.workflowId,
      progressToken,
    });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
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
    };
  }
}
