import { OPERATION_NAME, TReplyToCommentParams, TReplyToCommentResult } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class ReplyToCommentTool extends OperationTool<
  TReplyToCommentParams,
  TReplyToCommentResult
> {
  public override readonly name = 'reply_to_comment';
  public override readonly operationName = OPERATION_NAME.replyToComment;
  protected override readonly schema = z.object({
    commentUrl: z.string(),
    text: z.string().min(1),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        "Reply to a comment by commentUrl; returns the reply's URN and URL. If this workflow is still running, do not retry this tool; retrying can post duplicate replies.",
      inputSchema: {
        type: 'object',
        properties: {
          commentUrl: {
            type: 'string',
            description: 'LinkedIn URL of the comment to reply to.',
          },
          text: {
            type: 'string',
            description: 'Reply text, must be up to 1000 characters.',
          },
        },
        required: ['commentUrl', 'text'],
      },
    };
  }
}
