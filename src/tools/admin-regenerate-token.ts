import { LinkedApiAdmin, TRegenerateTokenParams, TRegenerateTokenResult } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminRegenerateTokenTool extends AdminTool<
  TRegenerateTokenParams,
  TRegenerateTokenResult
> {
  public readonly name = 'admin_regenerate_token';
  protected readonly schema = z.object({
    accountId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TRegenerateTokenParams;
  }): Promise<TRegenerateTokenResult> {
    return await admin.accounts.regenerateIdentificationToken(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Regenerate identification token for an account. The old token becomes invalid immediately.',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'UUID of the account',
          },
        },
        required: ['accountId'],
      },
    };
  }
}
