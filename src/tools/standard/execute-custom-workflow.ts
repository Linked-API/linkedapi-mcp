import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { executeCustomWorkflowSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TWorkflowDefinition } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getExecuteCustomWorkflowTool = (): Tool => ({
  name: "execute_custom_workflow",
  description: "Execute a custom workflow definition",
  inputSchema: {
    type: "object",
    properties: { definition: { type: "object" } },
    required: ["definition"],
  },
});

const executeCustomWorkflow = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = executeCustomWorkflowSchema.parse(args);
  const progressToken = "execute_custom_workflow";
  const workflow = await linkedapi.executeCustomWorkflow(
    params.definition as TWorkflowDefinition,
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

export const executeCustomWorkflowTool: ToolHandler = {
  tool: getExecuteCustomWorkflowTool(),
  handler: executeCustomWorkflow,
};
