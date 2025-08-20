import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { nvSyncConversationSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TNvSyncConversationParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getNvSyncConversationTool = (): Tool => ({
  name: "nv_sync_conversation",
  description:
    "Allows you to sync a conversation in Sales Navigator so you can start polling it. (nv.syncConversation action).",
  inputSchema: {
    type: "object",
    properties: {
      personUrl: {
        type: "string",
        description:
          "The LinkedIn URL of the person whose Sales Navigator conversation to sync (e.g., 'https://www.linkedin.com/in/john-doe')",
      },
    },
    required: ["personUrl"],
  },
});

const salesNavigatorSyncConversation = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = nvSyncConversationSchema.parse(args);
  const progressToken = "nv_sync_conversation";
  const workflow = await linkedapi.salesNavigatorSyncConversation(
    params as TNvSyncConversationParams,
  );
  await executeWithProgress(progressToken, progressCallback, workflow);
  return {
    content: [
      {
        type: "text",
        text: "Sales Navigator conversation synced",
      },
    ],
  };
};

export const nvSyncConversationTool: ToolHandler = {
  tool: getNvSyncConversationTool(),
  handler: salesNavigatorSyncConversation,
};
