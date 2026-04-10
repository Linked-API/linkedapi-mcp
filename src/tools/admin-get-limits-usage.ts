import { LinkedApiAdmin, TGetLimitsUsageParams, TLimitUsage } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetLimitsUsageTool extends AdminTool<
  TGetLimitsUsageParams,
  { usage: Array<TLimitUsage> }
> {
  public readonly name = 'admin_get_limits_usage';
  protected readonly schema = z.object({
    accountId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TGetLimitsUsageParams;
  }): Promise<{ usage: Array<TLimitUsage> }> {
    return await admin.limits.getUsage(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Get current usage against configured rate limits for an account.',
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
