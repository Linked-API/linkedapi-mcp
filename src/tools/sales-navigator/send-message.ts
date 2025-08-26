import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TNvSendMessageParams } from 'linkedapi-node';

import { nvSendMessageSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getNvSendMessageTool = (): Tool => ({
  name: 'nv_send_message',
  description:
    'Allows you to send a message to a person in Sales Navigator (nv.sendMessage action)',
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
      subject: {
        type: 'string',
        description: 'Subject line, must be up to 80 characters.',
      },
    },
    required: ['personUrl', 'text', 'subject'],
  },
});

const salesNavigatorSendMessage = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = nvSendMessageSchema.parse(args) as TNvSendMessageParams;
  const progressToken = 'nv_send_message';
  await executeWithProgress(progressToken, progressCallback, linkedapi.nvSendMessage, params);
  return {
    content: [
      {
        type: 'text',
        text: 'Sales Navigator message sent',
      },
    ],
  };
};

export const nvSendMessageTool: ToolHandler = {
  tool: getNvSendMessageTool(),
  handler: salesNavigatorSendMessage,
};
