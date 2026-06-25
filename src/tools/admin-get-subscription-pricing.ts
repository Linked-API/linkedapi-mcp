import { LinkedApiAdmin, TSubscriptionProduct } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetSubscriptionPricingTool extends AdminTool<
  Record<string, never>,
  { products: Array<TSubscriptionProduct> }
> {
  public readonly name = 'admin_get_subscription_pricing';
  protected readonly schema = z.object({});

  public override async execute({
    admin,
  }: {
    admin: LinkedApiAdmin;
    args: Record<string, never>;
  }): Promise<{ products: Array<TSubscriptionProduct> }> {
    return await admin.subscription.getPricing();
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Get available subscription products and prices.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
