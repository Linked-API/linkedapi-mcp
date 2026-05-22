import LinkedApi, {
  Operation,
  OPERATION_NAME,
  TMappedResponse,
  TOperationName,
  TWorkflowInProgressResponse,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import type { TWorkflowAck } from '../types/linked-api-tool-result.type.js';
import { defineRequestTimeoutInSeconds } from '../utils/define-request-timeout.js';
import { LinkedApiTool } from '../utils/linked-api-tool.js';

const POLL_INTERVAL_MS = 5000 as const;
const REQUEST_BUDGET_BUFFER_SECONDS = 5 as const;

interface IGetWorkflowResultParams {
  workflowId: string;
  operationName: string;
  waitSeconds?: number;
}

export class GetWorkflowResultTool extends LinkedApiTool<IGetWorkflowResultParams, unknown> {
  public readonly name = 'get_workflow_result';
  protected readonly schema = z.object({
    workflowId: z.string(),
    operationName: z.enum(Object.values(OPERATION_NAME)),
    waitSeconds: z.number().int().min(0).optional(),
  });

  public override async execute({
    linkedapi,
    args: { workflowId, operationName, waitSeconds },
    mcpClient,
  }: {
    linkedapi: LinkedApi;
    args: IGetWorkflowResultParams;
    mcpClient: string;
  }): Promise<TMappedResponse<unknown> | TWorkflowAck> {
    const typedOperationName = operationName as TOperationName;
    const operation = linkedapi.operations.find(
      (operation) => operation.operationName === typedOperationName,
    )! as Operation<unknown, unknown>;

    const cap = Math.max(
      defineRequestTimeoutInSeconds(mcpClient) - REQUEST_BUDGET_BUFFER_SECONDS,
      0,
    );
    const budgetSeconds = Math.min(waitSeconds ?? cap, cap);
    const deadline = Date.now() + budgetSeconds * 1000;

    while (true) {
      const status = await operation.status(workflowId);
      if (!isWorkflowInProgress(status)) {
        return status;
      }
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) {
        return { ...status,
workflowId,
operationName: typedOperationName };
      }
      await sleep(Math.min(POLL_INTERVAL_MS, remainingMs));
    }
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Check the current state of a previously started Linked API workflow. Returns the final result when the workflow has completed, otherwise returns the current in-progress snapshot ({status, workflowId, operationName, message}). The server long-polls up to waitSeconds while the workflow is still running; if the budget elapses without completion, the in-progress snapshot is returned and the client should call this tool again with the same workflowId and operationName.',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: {
            type: 'string',
            description: 'Required. The workflow ID returned by the original Linked API tool call.',
          },
          operationName: {
            type: 'string',
            description:
              'Required. The operationName returned by the original Linked API tool call. Used to map the response to the right operation.',
          },
          waitSeconds: {
            type: 'number',
            description:
              'Optional. Maximum seconds the server should wait for the workflow to complete before returning the current in-progress snapshot. Defaults to the maximum the current MCP client allows; pass 0 to get an immediate one-shot snapshot.',
          },
        },
        required: ['workflowId', 'operationName'],
      },
    };
  }
}

function isWorkflowInProgress(
  result: TMappedResponse<unknown> | TWorkflowInProgressResponse,
): result is TWorkflowInProgressResponse {
  return (
    'workflowStatus' in result &&
    (result.workflowStatus === 'running' || result.workflowStatus === 'pending')
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
