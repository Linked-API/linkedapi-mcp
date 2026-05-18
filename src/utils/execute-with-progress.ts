import { LinkedApiWorkflowTimeoutError, Operation, TMappedResponse } from '@linkedapi/node';

import { LinkedApiProgressNotification } from './types';

const WORKFLOW_PROGRESS_TOTAL = 100 as const;
const MIN_PROGRESS_INTERVAL = 10000 as const;

interface TExecuteWithProgressOptions<TParams, TResult> {
  progressCallback: (progress: LinkedApiProgressNotification) => void;
  operation: Operation<TParams, TResult>;
  workflowTimeout: number;
  params?: TParams;
  workflowId?: string;
  progressToken?: string | number;
}

export async function executeWithProgress<TParams, TResult>({
  progressCallback,
  operation,
  workflowTimeout,
  params,
  workflowId,
  progressToken,
}: TExecuteWithProgressOptions<TParams, TResult>): Promise<TMappedResponse<TResult>> {
  let progress = 0;

  progressCallback({
    progressToken,
    progress,
    total: WORKFLOW_PROGRESS_TOTAL,
    message: `Starting Linked API workflow ${operation.operationName}. The action may enter the cloud-browser queue and take several minutes.`,
  });

  const interval = setInterval(
    () => {
      if (progress < 50) {
        progress += 5;
      } else if (progress < 98) {
        progress += 1;
      }

      progressCallback({
        progressToken,
        progress,
        total: WORKFLOW_PROGRESS_TOTAL,
        message: `Waiting for workflow ${operation.operationName}. Linked API is still processing it in the background.`,
      });
    },
    Math.max(workflowTimeout / 20, MIN_PROGRESS_INTERVAL),
  );

  try {
    if (!workflowId) {
      workflowId = await operation.execute(params as TParams);
      progressCallback({
        progressToken,
        progress,
        total: WORKFLOW_PROGRESS_TOTAL,
        message: `Workflow ${operation.operationName} is queued or running in the background. workflowId: ${workflowId}.`,
      });
    }
    const result = await operation.result(workflowId, {
      timeout: workflowTimeout,
    });
    clearInterval(interval);

    progressCallback({
      progressToken,
      progress: WORKFLOW_PROGRESS_TOTAL,
      total: WORKFLOW_PROGRESS_TOTAL,
      message: `Workflow ${operation.operationName} completed successfully`,
    });

    return result;
  } catch (error) {
    clearInterval(interval);
    if (error instanceof LinkedApiWorkflowTimeoutError) {
      throw generateTimeoutError(error);
    }

    throw error;
  }
}

function generateTimeoutError(error: LinkedApiWorkflowTimeoutError): LinkedApiWorkflowTimeoutError {
  const restoreMessage = `Workflow is still running in Linked API's cloud-browser queue or background worker.

This is not a failure. The original tool already started the workflow, so retrying it can create duplicate queued work.

ACTION REQUIRED (MCP CLIENT):
- Do not retry the original tool; the workflow is already running
- Call the get_workflow_result tool with the parameters below and keep listening until completion

PARAMETERS TO USE:
- workflowId: ${error.workflowId}
- operationName: ${error.operationName}

GENERIC MCP CALL EXAMPLE:
{
  "name": "get_workflow_result",
  "arguments": {
    "workflowId": "${error.workflowId}",
    "operationName": "${error.operationName}"
  }
}

Background processing keeps the MCP client responsive while the workflow completes.`;

  error.message = restoreMessage;
  return error;
}
