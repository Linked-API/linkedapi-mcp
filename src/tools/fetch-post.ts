import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TFetchPostParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class FetchPostTool extends OperationTool<TFetchPostParams, unknown> {
  public override readonly name = 'fetch_post';
  public override readonly operationName = OPERATION_NAME.fetchPost;
  protected override readonly schema = z.object({
    postUrl: z.string(),
    retrieveComments: z.boolean().optional(),
    retrieveReactions: z.boolean().optional(),
    commentsRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(500).optional(),
        replies: z.boolean().optional(),
        sort: z.enum(['mostRelevant', 'mostRecent']).optional(),
      })
      .optional(),
    reactionsRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(1000).optional(),
      })
      .optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Open a LinkedIn post and retrieve its data, with optional comments and reactions. (st.openPost action).',
      inputSchema: {
        type: 'object',
        properties: {
          postUrl: {
            type: 'string',
            description:
              "LinkedIn URL of the post. (e.g., 'https://www.linkedin.com/posts/username_activity-id')",
          },
          retrieveComments: {
            type: 'boolean',
            description:
              'Optional. When true, also retrieve comments for the post. Configure via commentsRetrievalConfig.',
          },
          retrieveReactions: {
            type: 'boolean',
            description:
              'Optional. When true, also retrieve reactions for the post. Configure via reactionsRetrievalConfig.',
          },
          commentsRetrievalConfig: {
            type: 'object',
            description:
              'Optional. Applies only when retrieveComments is true. Controls comments retrieval (limit, replies, sort).',
            properties: {
              limit: {
                type: 'number',
                description:
                  'Optional. Max number of comments to retrieve. Defaults to 10, with a maximum value of 500.',
              },
              replies: {
                type: 'boolean',
                description: 'Optional. When true, include replies to comments (threaded).',
              },
              sort: {
                type: 'string',
                enum: ['mostRelevant', 'mostRecent'],
                description:
                  "Optional. Sort order for comments. One of 'mostRelevant' or 'mostRecent'.",
              },
            },
          },
          reactionsRetrievalConfig: {
            type: 'object',
            description:
              'Optional. Applies only when retrieveReactions is true. Controls reactions retrieval (limit).',
            properties: {
              limit: {
                type: 'number',
                description:
                  'Optional. Max number of reactions to retrieve. Defaults to 10, with a maximum value of 1000.',
              },
            },
          },
        },
        required: ['postUrl'],
      },
    };
  }
}
