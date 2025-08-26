import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TSendMessageParams } from 'linkedapi-node';

import { sendMessageSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getSendMessageTool = (): Tool => ({
  name: 'send_message',
  description: 'Allows you to send a message to a person (st.sendMessage action).',
  inputSchema: {
    type: 'object',
    properties: {
      personUrl: {
        type: 'string',
        description:
          "LinkedIn URL of the person you want to send a message to (e.g., 'https://www.linkedin.com/in/john-doe')",
      },
      text: {
        type: 'string',
        description: 'The message text, must be up to 1900 characters.',
      },
    },
    required: ['personUrl', 'text'],
  },
});

const sendMessage = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = sendMessageSchema.parse(args) as TSendMessageParams;
  const progressToken = 'send_message';
  await executeWithProgress(progressToken, progressCallback, linkedapi.sendMessage, params);
  return {
    content: [
      {
        type: 'text',
        text: 'Message sent',
      },
    ],
  };
};

export const sendMessageTool: ToolHandler = {
  tool: getSendMessageTool(),
  handler: sendMessage,
};
