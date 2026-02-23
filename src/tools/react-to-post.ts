import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TReactToPostParams } from '@linkedapi/node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class ReactToPostTool extends OperationTool<TReactToPostParams, unknown> {
  public override readonly name = 'react_to_post';
  public override readonly operationName = OPERATION_NAME.reactToPost;
  protected override readonly schema = z.object({
    postUrl: z.string(),
    type: z.enum(['like', 'love', 'celebrate', 'support', 'funny', 'insightful']).or(z.string()),
    companyUrl: z.string().optional(),
  });

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
          companyUrl: {
            type: 'string',
            description:
              "LinkedIn company page URL. If specified, the reaction will be added on behalf of the company. (e.g., 'https://www.linkedin.com/company/acme-corp')",
          },
        },
        required: ['postUrl', 'type'],
      },
    };
  }
}
