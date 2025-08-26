import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TWithdrawConnectionRequestParams } from 'linkedapi-node';

import { withdrawConnectionRequestSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getWithdrawConnectionRequestTool = (): Tool => ({
  name: 'withdraw_connection_request',
  description:
    'Allows you to withdraw the connection request sent to a person (st.withdrawConnectionRequest action).',
  inputSchema: {
    type: 'object',
    properties: {
      personUrl: {
        type: 'string',
        description:
          "Public or hashed LinkedIn URL of the person you want to withdraw the connection request from. (e.g., 'https://www.linkedin.com/in/john-doe')",
      },
      unfollow: {
        type: 'boolean',
        description:
          'Optional. Boolean indicating whether you want to unfollow the person when withdrawing the request. The default value is true.',
      },
    },
    required: ['personUrl'],
  },
});

const withdrawConnectionRequest = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = withdrawConnectionRequestSchema.parse(args) as TWithdrawConnectionRequestParams;
  const progressToken = 'withdraw_connection_request';
  await executeWithProgress(
    progressToken,
    progressCallback,
    linkedapi.withdrawConnectionRequest,
    params,
  );
  return {
    content: [
      {
        type: 'text',
        text: 'Connection request withdrawn',
      },
    ],
  };
};

export const withdrawConnectionRequestTool: ToolHandler = {
  tool: getWithdrawConnectionRequestTool(),
  handler: withdrawConnectionRequest,
};
