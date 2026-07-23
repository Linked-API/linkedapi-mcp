import { OPERATION_NAME, TReactToCommentParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class ReactToCommentTool extends OperationTool<TReactToCommentParams, void> {
  public override readonly name = 'react_to_comment';
  public override readonly operationName = OPERATION_NAME.reactToComment;
  protected override readonly schema = z.object({
    commentUrl: z.string(),
    type: z.enum(['like', 'love', 'support', 'celebrate', 'insightful', 'funny']).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'React to a comment by commentUrl (like, love, support, celebrate, insightful, funny). If this workflow is still running, do not retry this tool; retrying can queue duplicate reaction attempts.',
      inputSchema: {
        type: 'object',
        properties: {
          commentUrl: {
            type: 'string',
            description: 'LinkedIn URL of the comment to react to.',
          },
          type: {
            type: 'string',
            description: 'Optional. Enum describing the reaction type. Defaults to "like".',
            enum: ['like', 'love', 'support', 'celebrate', 'insightful', 'funny'],
          },
        },
        required: ['commentUrl'],
      },
    };
  }
}
