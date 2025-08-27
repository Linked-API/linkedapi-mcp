import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TFetchPostParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class FetchPostTool extends OperationTool<TFetchPostParams, unknown> {
  public override readonly name = 'fetch_post';
  protected override readonly schema = z.object({
    postUrl: z.string(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.fetchPost, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'This action allows you to open a post to retrieve its data. (st.openPost action).',
      inputSchema: {
        type: 'object',
        properties: {
          postUrl: {
            type: 'string',
            description:
              "LinkedIn URL of the post. (e.g., 'https://www.linkedin.com/posts/username_activity-id')",
          },
        },
        required: ['postUrl'],
      },
    };
  }
}
