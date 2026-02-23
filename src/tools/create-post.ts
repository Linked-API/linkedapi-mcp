import { OPERATION_NAME, TCreatePostParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class CreatePostTool extends OperationTool<TCreatePostParams, unknown> {
  public override readonly name = 'create_post';
  public override readonly operationName = OPERATION_NAME.createPost;
  protected override readonly schema = z.object({
    text: z.string().min(1).max(3000),
    companyUrl: z.string().optional(),
    attachments: z
      .array(
        z.object({
          url: z.string(),
          type: z.enum(['image', 'video', 'document']),
          name: z.string().optional(),
        }),
      )
      .max(9)
      .optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Creates a new LinkedIn post with optional media attachments (st.createPost action).',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Post content, must be up to 3000 characters.',
          },
          companyUrl: {
            type: 'string',
            description:
              'LinkedIn company page URL. If specified, the post will be created on the company page (requires admin access).',
          },
          attachments: {
            type: 'array',
            description:
              'Media attachments for the post. You can add up to 9 images, or 1 video, or 1 document. Cannot mix different attachment types.',
            items: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Publicly accessible URL of the media file.',
                },
                type: {
                  type: 'string',
                  enum: ['image', 'video', 'document'],
                  description: 'Type of media attachment.',
                },
                name: {
                  type: 'string',
                  description: 'Display name for the document (required for documents).',
                },
              },
              required: ['url', 'type'],
            },
          },
        },
        required: ['text'],
      },
    };
  }
}
