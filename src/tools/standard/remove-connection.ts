import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { removeConnectionSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TRemoveConnectionParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getRemoveConnectionTool = (): Tool => ({
  name: "remove_connection",
  description:
    "Allows you to remove a person from your connections (st.removeConnection action).",
  inputSchema: {
    type: "object",
    properties: {
      personUrl: {
        type: "string",
        description:
          "Public or hashed LinkedIn URL of the person you want to remove from your connections. (e.g., 'https://www.linkedin.com/in/john-doe')",
      },
    },
    required: ["personUrl"],
  },
});

const removeConnection = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = removeConnectionSchema.parse(args);
  const progressToken = "remove_connection";
  const workflow = await linkedapi.removeConnection(
    params as TRemoveConnectionParams,
  );
  await executeWithProgress(progressToken, progressCallback, workflow);
  return {
    content: [
      {
        type: "text",
        text: "Connection removed",
      },
    ],
  };
};

export const removeConnectionTool: ToolHandler = {
  tool: getRemoveConnectionTool(),
  handler: removeConnection,
};
