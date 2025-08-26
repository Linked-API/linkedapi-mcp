import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TReactToPostParams } from 'linkedapi-node';

import { reactToPostSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getReactToPostTool = (): Tool => ({
  name: 'react_to_post',
  description:
    'Allows you to react to a post using any available reaction type (st.reactToPost action).',
  inputSchema: {
    type: 'object',
    properties: {
      postUrl: {
        type: 'string',
        description:
          "LinkedIn URL of the post to react. (e.g., 'https://www.linkedin.com/posts/username_activity-id')",
      },
      type: {
        type: 'string',
        description: 'Enum describing the reaction type.',
        enum: ['like', 'love', 'support', 'celebrate', 'insightful', 'funny'],
      },
    },
    required: ['postUrl', 'type'],
  },
});

const reactToPost = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = reactToPostSchema.parse(args) as TReactToPostParams;
  const progressToken = 'react_to_post';
  await executeWithProgress(progressToken, progressCallback, linkedapi.reactToPost, params);
  return {
    content: [
      {
        type: 'text',
        text: 'Reaction added',
      },
    ],
  };
};

export const reactToPostTool: ToolHandler = {
  tool: getReactToPostTool(),
  handler: reactToPost,
};
