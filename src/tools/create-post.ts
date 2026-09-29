import { OPERATION_NAME, TCreatePostParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class CreatePostTool extends OperationTool<TCreatePostParams, unknown> {
  public override readonly name = 'create_post';
  public override readonly operationName = OPERATION_NAME.createPost;
  protected override readonly schema = z.object({
    text: z.string().min(1).max(3000),
    mentions: z
      .array(
        z.object({
          key: z.string(),
          name: z.string(),
          urn: z.string().optional(),
          personHashedUrl: z.string().optional(),
          companyHashedUrl: z.string().optional(),
        }),
      )
      .optional(),
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
        'Creates a new LinkedIn post with optional mentions and media attachments (st.createPost action). Returns the URL and URN of the new post. If this workflow is still running, do not retry this tool; retrying can create duplicate posts.',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description:
              'Post content, must be up to 3000 characters. Write "@[key]" where a mention should appear and describe that key in mentions.',
          },
          mentions: {
            type: 'array',
            description:
              'People and companies to mention in the text. Each item binds a "@[key]" placeholder to one entity.',
            items: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                  description:
                    'Placeholder name used in the text as "@[key]". 1-30 characters: letters, digits, underscore or hyphen.',
                },
                name: {
                  type: 'string',
                  description:
                    'Name to find the person or company by. Always required: LinkedIn resolves a mention through its own name suggestions.',
                },
                urn: {
                  type: 'string',
                  description:
                    "URN of the entity (e.g., 'urn:li:member:123456789' or 'urn:li:organization:1234567'). Decides which of the offered namesakes is taken.",
                },
                personHashedUrl: {
                  type: 'string',
                  description:
                    'Hashed LinkedIn profile URL of the person, as an alternative to urn.',
                },
                companyHashedUrl: {
                  type: 'string',
                  description: 'Hashed LinkedIn company page URL, as an alternative to urn.',
                },
              },
              required: ['key', 'name'],
            },
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
