import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { sendConnectionRequestSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TSendConnectionRequestParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getSendConnectionRequestTool = (): Tool => ({
  name: "send_connection_request",
  description:
    "Allows you to send a connection request to a person (st.sendConnectionRequest action).",
  inputSchema: {
    type: "object",
    properties: {
      personUrl: {
        type: "string",
        description:
          "Public or hashed LinkedIn URL of the person you want to send a connection request to. (e.g., 'https://www.linkedin.com/in/john-doe')",
      },
      note: {
        type: "string",
        description: "Optional. Note to include with the connection request.",
      },
      email: {
        type: "string",
        description:
          "Optional. Email address required by some people for sending connection requests to them. If it is required and not provided, the connection request will fail.",
      },
    },
    required: ["personUrl"],
  },
});

const sendConnectionRequest = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = sendConnectionRequestSchema.parse(args);
  const progressToken = "send_connection_request";
  const workflow = await linkedapi.sendConnectionRequest(
    params as TSendConnectionRequestParams,
  );
  await executeWithProgress(progressToken, progressCallback, workflow);
  return {
    content: [
      {
        type: "text",
        text: "Connection request sent",
      },
    ],
  };
};

export const sendConnectionRequestTool: ToolHandler = {
  tool: getSendConnectionRequestTool(),
  handler: sendConnectionRequest,
};
