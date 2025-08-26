import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TSyncConversationParams } from 'linkedapi-node';

import { syncConversationSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getSyncConversationTool = (): Tool => ({
  name: 'sync_conversation',
  description:
    'Allows you to sync a conversation so you can start polling it (st.syncConversation action).',
  inputSchema: {
    type: 'object',
    properties: {
      personUrl: {
        type: 'string',
        description:
          "The LinkedIn URL of the person whose conversation you want to synchronize (e.g., 'https://www.linkedin.com/in/john-doe')",
      },
    },
    required: ['personUrl'],
  },
});

const syncConversation = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = syncConversationSchema.parse(args) as TSyncConversationParams;
  const progressToken = 'sync_conversation';
  await executeWithProgress(progressToken, progressCallback, linkedapi.syncConversation, params);
  return {
    content: [
      {
        type: 'text',
        text: 'Conversation synced',
      },
    ],
  };
};

export const syncConversationTool: ToolHandler = {
  tool: getSyncConversationTool(),
  handler: syncConversation,
};
