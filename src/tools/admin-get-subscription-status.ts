import { LinkedApiAdmin, TSubscriptionStatus } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetSubscriptionStatusTool extends AdminTool<
  Record<string, never>,
  TSubscriptionStatus
> {
  public readonly name = 'admin_get_subscription_status';
  protected readonly schema = z.object({});

  public override async execute({
    admin,
  }: {
    admin: LinkedApiAdmin;
    args: Record<string, never>;
  }): Promise<TSubscriptionStatus> {
    return await admin.subscription.getStatus();
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Get current subscription status, trial eligibility, and cancellation schedule.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
