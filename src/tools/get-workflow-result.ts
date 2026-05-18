import LinkedApi, { OPERATION_NAME, TMappedResponse } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { executeWithProgress } from '../utils/execute-with-progress.js';
import { LinkedApiTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

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

  public override async execute({
    linkedapi,
    args: { workflowId, operationName },
    workflowTimeout,
    progressToken,
    progressCallback,
  }: {
    linkedapi: LinkedApi;
    args: IGetWorkflowResultParams;
    workflowTimeout: number;
    progressToken?: string | number;
    progressCallback: (progress: LinkedApiProgressNotification) => void;
  }): Promise<TMappedResponse<unknown>> {
    const operation = linkedapi.operations.find(
      (operation) => operation.operationName === operationName,
    )!;
    return await executeWithProgress({
      progressCallback,
      operation,
      workflowTimeout,
      workflowId,
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
            description:
              'Required. The workflow ID provided in the background workflow status message.',
          },
          operationName: {
            type: 'string',
            description:
              'Required. The operationName provided in the background workflow status message. Use the exact value so the result can be restored correctly.',
          },
        },
        required: ['workflowId', 'operationName'],
      },
    };
  }
}
