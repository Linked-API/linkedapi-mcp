import { LinkedApiAdmin, TCancelResult } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminCancelSubscriptionTool extends AdminTool<Record<string, never>, TCancelResult> {
  public readonly name = 'admin_cancel_subscription';
  protected readonly schema = z.object({});

  public override async execute({
    admin,
  }: {
    admin: LinkedApiAdmin;
    args: Record<string, never>;
  }): Promise<TCancelResult> {
    return await admin.subscription.cancel();
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Cancel the current subscription at the end of the billing period.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
