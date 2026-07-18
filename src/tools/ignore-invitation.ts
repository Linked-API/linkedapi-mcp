import { OPERATION_NAME, TIgnoreInvitationParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class IgnoreInvitationTool extends OperationTool<TIgnoreInvitationParams, unknown> {
  public override readonly name = 'ignore_invitation';
  public override readonly operationName = OPERATION_NAME.ignoreInvitation;
  protected override readonly schema = z.discriminatedUnion('invitationType', [
    z
      .object({
        invitationType: z.literal('connect'),
        personUrl: z.string(),
      })
      .strict(),
    z
      .object({
        invitationType: z.literal('companyFollow'),
        companyUrl: z.string(),
      })
      .strict(),
    z
      .object({
        invitationType: z.literal('newsletterSubscribe'),
        newsletterUrl: z.string(),
      })
      .strict(),
  ]);

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Ignores an incoming connection, company-follow, or newsletter-subscription invitation (st.ignoreInvitation action). Set invitationType and provide only its matching URL. If this workflow is still running, do not retry this tool; retrying can queue duplicate ignore attempts.',
      inputSchema: {
        type: 'object',
        properties: {
          invitationType: {
            type: 'string',
            enum: ['connect', 'companyFollow', 'newsletterSubscribe'],
            description: 'Invitation type to ignore.',
          },
          personUrl: {
            type: 'string',
            description:
              "Required only for invitationType 'connect'. Public or hashed LinkedIn URL of the person.",
          },
          companyUrl: {
            type: 'string',
            description:
              "Required only for invitationType 'companyFollow'. LinkedIn company page URL.",
          },
          newsletterUrl: {
            type: 'string',
            description:
              "Required only for invitationType 'newsletterSubscribe'. LinkedIn newsletter URL.",
          },
        },
        required: ['invitationType'],
        additionalProperties: false,
        oneOf: [
          {
            properties: {
              invitationType: { const: 'connect' },
              personUrl: { type: 'string' },
            },
            required: ['invitationType', 'personUrl'],
            additionalProperties: false,
          },
          {
            properties: {
              invitationType: { const: 'companyFollow' },
              companyUrl: { type: 'string' },
            },
            required: ['invitationType', 'companyUrl'],
            additionalProperties: false,
          },
          {
            properties: {
              invitationType: { const: 'newsletterSubscribe' },
              newsletterUrl: { type: 'string' },
            },
            required: ['invitationType', 'newsletterUrl'],
            additionalProperties: false,
          },
        ],
      } as Tool['inputSchema'],
    };
  }
}
