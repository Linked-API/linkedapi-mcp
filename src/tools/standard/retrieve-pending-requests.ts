import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi from 'linkedapi-node';

import { retrievePendingRequestsSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getRetrievePendingRequestsTool = (): Tool => ({
  name: 'retrieve_pending_requests',
  description:
    'Allows you to retrieve pending connection requests sent from your account. (st.retrievePendingRequests action).',
  inputSchema: {
    type: 'object',
    properties: {},
  },
});

const retrievePendingRequests = async (
  linkedapi: LinkedApi,
  _args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  retrievePendingRequestsSchema.parse(_args ?? {});
  const progressToken = 'retrieve_pending_requests';
  const result = await executeWithProgress(
    progressToken,
    progressCallback,
    linkedapi.retrievePendingRequests,
  );
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const retrievePendingRequestsTool: ToolHandler = {
  tool: getRetrievePendingRequestsTool(),
  handler: retrievePendingRequests,
};
