import { LinkedApiAdmin, TBillingLinkResult } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetBillingLinkTool extends AdminTool<Record<string, never>, TBillingLinkResult> {
  public readonly name = 'admin_get_billing_link';
  protected readonly schema = z.object({});

  public override async execute({
    admin,
  }: {
    admin: LinkedApiAdmin;
    args: Record<string, never>;
  }): Promise<TBillingLinkResult> {
    return await admin.subscription.getBillingLink();
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Get a Stripe billing portal link for the current workspace.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
