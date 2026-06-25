import { LinkedApiAdmin, TGetLimitsParams, TLimit } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetLimitsTool extends AdminTool<TGetLimitsParams, { limits: Array<TLimit> }> {
  public readonly name = 'admin_get_limits';
  protected readonly schema = z.object({
    accountId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TGetLimitsParams;
  }): Promise<{ limits: Array<TLimit> }> {
    return await admin.limits.get(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Get configured rate limits for an account.',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'Account UUID',
          },
        },
        required: ['accountId'],
      },
    };
  }
}
