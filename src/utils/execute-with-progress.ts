import {
  LinkedApiWorkflowTimeoutError,
  TMappedResponse,
  WorkflowHandler,
} from "linkedapi-node";
import { ProgressNotification } from "../types";

export async function executeWithProgress<T>(
  progressToken: string,
  progressCallback: ((progress: ProgressNotification) => void) | undefined,
  workflowHandler: WorkflowHandler<T>,
): Promise<TMappedResponse<T>> {
  const workflowTimeout =
    parseInt(process.env.HEALTH_CHECK_PERIOD || "60", 10) * 1000;
  let progress = 0;

  if (progressCallback) {
    progressCallback({
      progressToken,
      progress,
      total: 100,
      message: `Starting workflow ${progressToken}...`,
    });
  }

  const interval = setInterval(() => {
    if (progressCallback) {
      if (progress < 50) {
        progress += 5;
      } else if (progress < 98) {
        progress += 1;
      }

      progressCallback({
        progressToken,
        progress,
        total: 100,
        message: `Executing workflow ${progressToken}...`,
      });
    }
  }, 60000);

  try {
    const result = await workflowHandler.result({ timeout: workflowTimeout });
    clearInterval(interval);

    if (progressCallback) {
      progressCallback({
        progressToken,
        progress: 100,
        total: 100,
        message: `Workflow ${progressToken} completed successfully`,
      });
    }

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

  The workflow is actively processing and can be monitored using the restore_workflow tool.
  
  Continue Listening:
  - workflowId: ${error.workflowId}
  - functionName: ${error.functionName}
  
  Use these parameters with the restore_workflow tool to continue listening for updates.
  Background processing keeps the MCP client responsive while the workflow completes.`;

  error.message = restoreMessage;
  return error;
}
