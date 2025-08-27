import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TReactToPostParams } from 'linkedapi-node';
import { z } from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { OperationTool } from '../linked-api-tool.js';

export class ReactToPostTool extends OperationTool<TReactToPostParams, unknown> {
  public override readonly name = 'react_to_post';
  protected override readonly schema = z.object({
    postUrl: z.string(),
    type: z.enum(['like', 'love', 'celebrate', 'support', 'funny', 'insightful']).or(z.string()),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.reactToPost, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
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
    };
  }
}
