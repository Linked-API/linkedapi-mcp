import { LinkedApiWorkflowTimeoutError, Operation, TMappedResponse } from 'linkedapi-node';

import { LinkedApiProgressNotification } from './types';

export async function executeWithProgress<TParams, TResult>(
  progressCallback: (progress: LinkedApiProgressNotification) => void,
  operation: Operation<TParams, TResult>,
  {
    params,
    workflowId,
    progressToken,
  }: { params?: TParams; workflowId?: string; progressToken?: string | number } = {},
): Promise<TMappedResponse<TResult>> {
  const workflowTimeout = parseInt(process.env.HEALTH_CHECK_PERIOD || '180', 10) * 1000;
  let progress = 0;

  progressCallback({
    progressToken,
    progress,
    total: 100,
    message: `Starting workflow ${operation.operationName}...`,
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
        total: 100,
        message: `Executing workflow ${operation.operationName}...`,
      });
    },
    Math.max(workflowTimeout / 20, 10000),
  );

  try {
    if (!workflowId) {
      workflowId = await operation.execute(params as TParams);
    }
    const result = await operation.result(workflowId, {
      timeout: workflowTimeout,
    });
    clearInterval(interval);

    progressCallback({
      progressToken,
      progress: 100,
      total: 100,
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

function generateTimeoutError(error: LinkedApiWorkflowTimeoutError) {
  const restoreMessage = `Workflow is running in the background. Continue listening for updates.

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
