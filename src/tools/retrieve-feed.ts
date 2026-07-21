import { OPERATION_NAME, TFeedPost, TRetrieveFeedParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class RetrieveFeedTool extends OperationTool<TRetrieveFeedParams, Array<TFeedPost>> {
  public override readonly name = 'retrieve_feed';
  public override readonly operationName = OPERATION_NAME.retrieveFeed;
  protected override readonly schema = z.object({
    limit: z.number().int().min(1).max(100).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        "Retrieves posts from the current account's personalized LinkedIn home feed (st.retrieveFeed action).",
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Maximum number of posts to retrieve (default 20).',
          },
        },
      },
    };
  }
}
