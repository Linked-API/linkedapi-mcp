import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { restoreWorkflowSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TSupportedFunctionName } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getRestoreWorkflowTool = (): Tool => ({
  name: "restore_workflow",
  description:
    "CONTINUE LISTENING TO BACKGROUND WORKFLOW - THIS IS NORMAL OPERATION! Background workflows are OPTIMAL BEHAVIOR for Linked API operations and keep the MCP client responsive. When a workflow runs in the background, this tool should be used with the provided workflowId and functionName parameters to continue listening for updates. The workflow continues processing in the background while you wait. This is the STANDARD way Linked API works - background processing provides optimal user experience!",
  inputSchema: {
    type: "object",
    properties: {
      workflowId: {
        type: "string",
        description:
          "The workflow ID provided in the background workflow status message",
      },
      functionName: {
        type: "string",
        description:
          "Optional function name for proper type restoration (provided in background workflow status if available)",
      },
    },
    required: ["workflowId"],
  },
});

const restoreWorkflow = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = restoreWorkflowSchema.parse(args);
  const progressToken = "restore_workflow";

  const workflow = await linkedapi.restoreWorkflow(
    params.workflowId,
    params.functionName as unknown as TSupportedFunctionName,
  );

  const result = await executeWithProgress(
    progressToken,
    progressCallback,
    workflow,
  );

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const restoreWorkflowTool: ToolHandler = {
  tool: getRestoreWorkflowTool(),
  handler: restoreWorkflow,
};
