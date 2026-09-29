import { OPERATION_NAME, TCreateRepostParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class CreateRepostTool extends OperationTool<TCreateRepostParams, unknown> {
  public override readonly name = 'create_repost';
  public override readonly operationName = OPERATION_NAME.createRepost;
  protected override readonly schema = z.object({
    postUrl: z.string().optional(),
    postUrn: z.string().optional(),
    text: z.string().max(3000).optional(),
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
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Reposts a LinkedIn post, either as is or with your own commentary (st.createRepost action). Returns the URL and URN of the repost itself, which is a post of your own account, not of the post that was reshared. Reposting the same post twice from the same account fails with alreadyReposted. If this workflow is still running, do not retry this tool; retrying can create duplicate reposts.',
      inputSchema: {
        type: 'object',
        properties: {
          postUrl: {
            type: 'string',
            description:
              "LinkedIn URL of the post to repost. (e.g., 'https://www.linkedin.com/posts/username_activity-id') Provide this or postUrn.",
          },
          postUrn: {
            type: 'string',
            description:
              "URN of the post to repost, as an alternative to postUrl. (e.g., 'urn:li:activity:1234567890123456789')",
          },
          text: {
            type: 'string',
            description:
              'Your own commentary, up to 3000 characters. Without it the post is reposted as is. Write "@[key]" where a mention should appear and describe that key in mentions.',
          },
          mentions: {
            type: 'array',
            description:
              'People and companies to mention in the commentary. Each item binds a "@[key]" placeholder to one entity.',
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
        },
        required: [],
      },
    };
  }
}
