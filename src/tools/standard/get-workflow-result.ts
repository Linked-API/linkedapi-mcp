import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { getWorkflowResultSchema } from "../../linked-api-schemas.js";
import LinkedApi from "linkedapi-node";

const getGetWorkflowResultTool = (): Tool => ({
  name: "get_workflow_result",
  description: "Get workflow result by ID",
  inputSchema: {
    type: "object",
    properties: { workflowId: { type: "string" } },
    required: ["workflowId"],
  },
});

const getWorkflowResult = async (
  linkedapi: LinkedApi,
  args: unknown,
  _progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = getWorkflowResultSchema.parse(args);
  const result = await linkedapi.getWorkflowResult(params.workflowId);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const getWorkflowResultTool: ToolHandler = {
  tool: getGetWorkflowResultTool(),
  handler: getWorkflowResult,
};
