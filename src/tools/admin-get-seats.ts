import { LinkedApiAdmin, TSubscriptionSeat } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetSeatsTool extends AdminTool<
  Record<string, never>,
  { seats: Array<TSubscriptionSeat> }
> {
  public readonly name = 'admin_get_seats';
  protected readonly schema = z.object({});

  public override async execute({
    admin,
  }: {
    admin: LinkedApiAdmin;
    args: Record<string, never>;
  }): Promise<{ seats: Array<TSubscriptionSeat> }> {
    return await admin.subscription.getSeats();
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Get active subscription seats. Each seat allows one connected LinkedIn account. Seat types: core (standard) and plus (includes Sales Navigator).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
