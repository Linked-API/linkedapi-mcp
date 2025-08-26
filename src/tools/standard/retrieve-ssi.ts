import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi from 'linkedapi-node';

import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getRetrieveSSITool = (): Tool => ({
  name: 'retrieve_ssi',
  description:
    'Allows you to retrieve your current SSI (Social Selling Index) (st.retrieveSSI action).',
  inputSchema: {
    type: 'object',
    properties: {},
  },
});

const retrieveSSI = async (
  linkedapi: LinkedApi,
  _args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const progressToken = 'retrieve_ssi';
  const result = await executeWithProgress(progressToken, progressCallback, linkedapi.retrieveSSI);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const retrieveSSITool: ToolHandler = {
  tool: getRetrieveSSITool(),
  handler: retrieveSSI,
};
