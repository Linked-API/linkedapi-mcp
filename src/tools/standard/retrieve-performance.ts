import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { retrievePerformanceSchema } from "../../linked-api-schemas.js";
import LinkedApi from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getRetrievePerformanceTool = (): Tool => ({
  name: "retrieve_performance",
  description:
    "Allows you to retrieve performance analytics from your LinkedIn dashboard (st.retrievePerformance action).",
  inputSchema: {
    type: "object",
    properties: {},
  },
});

const retrievePerformance = async (
  linkedapi: LinkedApi,
  _args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  retrievePerformanceSchema.parse(_args ?? {});
  const progressToken = "retrieve_performance";
  const workflow = await linkedapi.retrievePerformance();
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

export const retrievePerformanceTool: ToolHandler = {
  tool: getRetrievePerformanceTool(),
  handler: retrievePerformance,
};
