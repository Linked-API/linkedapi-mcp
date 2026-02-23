import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TCommentOnPostParams } from '@linkedapi/node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class CommentOnPostTool extends OperationTool<TCommentOnPostParams, unknown> {
  public override readonly name = 'comment_on_post';
  public override readonly operationName = OPERATION_NAME.commentOnPost;
  protected override readonly schema = z.object({
    postUrl: z.string(),
    text: z.string().min(1),
    companyUrl: z.string().optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Allows you to leave a comment on a post (st.commentOnPost action).',
      inputSchema: {
        type: 'object',
        properties: {
          postUrl: {
            type: 'string',
            description:
              "The LinkedIn post URL to comment on (e.g., 'https://www.linkedin.com/posts/username_activity-id')",
          },
          text: {
            type: 'string',
            description: 'Comment text, must be up to 1000 characters.',
          },
          companyUrl: {
            type: 'string',
            description:
              "LinkedIn company page URL. If specified, the comment will be added on behalf of the company. (e.g., 'https://www.linkedin.com/company/acme-corp')",
          },
        },
        required: ['postUrl', 'text'],
      },
    };
  }
}
