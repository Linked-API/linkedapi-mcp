import { LinkedApiAdmin, TResetLimitsParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminResetLimitsTool extends AdminTool<TResetLimitsParams, void> {
  public readonly name = 'admin_reset_limits';
  protected readonly schema = z.object({
    accountId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TResetLimitsParams;
  }): Promise<void> {
    await admin.limits.resetToDefaults(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Reset all rate limits for an account to the system defaults.',
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
