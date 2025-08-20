import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { checkConnectionStatusSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TCheckConnectionStatusParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getCheckConnectionStatusTool = (): Tool => ({
  name: "check_connection_status",
  description:
    "Allows you to check the connection status between your account and another person (st.checkConnectionStatus action).",
  inputSchema: {
    type: "object",
    properties: {
      personUrl: {
        type: "string",
        description:
          "Public or hashed LinkedIn URL of the person you want to check the connection status with. (e.g., 'https://www.linkedin.com/in/john-doe')",
      },
    },
    required: ["personUrl"],
  },
});

const checkConnectionStatus = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = checkConnectionStatusSchema.parse(args);
  const progressToken = "check_connection_status";
  const workflow = await linkedapi.checkConnectionStatus(
    params as TCheckConnectionStatusParams,
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

export const checkConnectionStatusTool: ToolHandler = {
  tool: getCheckConnectionStatusTool(),
  handler: checkConnectionStatus,
};
