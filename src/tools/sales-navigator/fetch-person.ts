import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TNvOpenPersonPageParams } from 'linkedapi-node';

import { nvFetchPersonSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getNvFetchPersonTool = (): Tool => ({
  name: 'nv_fetch_person',
  description:
    'Allows you to open a person page in Sales Navigator to retrieve their basic information (nv.openPersonPage action).',
  inputSchema: {
    type: 'object',
    properties: {
      personHashedUrl: {
        type: 'string',
        description: 'Hashed LinkedIn URL of the person.',
      },
    },
    required: ['personHashedUrl'],
  },
});

const salesNavigatorFetchPerson = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = nvFetchPersonSchema.parse(args) as TNvOpenPersonPageParams;
  const progressToken = 'nv_fetch_person';
  const result = await executeWithProgress(
    progressToken,
    progressCallback,
    linkedapi.nvFetchPerson,
    params,
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

export const nvFetchPersonTool: ToolHandler = {
  tool: getNvFetchPersonTool(),
  handler: salesNavigatorFetchPerson,
};
