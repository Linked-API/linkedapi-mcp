import { LinkedApiAdmin, TSetSeatsParams, TSetSeatsResult } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminSetSeatsTool extends AdminTool<TSetSeatsParams, TSetSeatsResult> {
  public readonly name = 'admin_set_seats';
  protected readonly schema = z.object({
    quantity: z.number().int().min(1).max(1000),
    seatType: z.enum(['core', 'plus']),
    billingPeriod: z.enum(['month', 'year']),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TSetSeatsParams;
  }): Promise<TSetSeatsResult> {
    return await admin.subscription.setSeats(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Set number of subscription seats. Returns checkout link if no active subscription, otherwise updates immediately.',
      inputSchema: {
        type: 'object',
        properties: {
          quantity: {
            type: 'number',
            description: 'Number of seats (1-1000)',
          },
          seatType: {
            type: 'string',
            enum: ['core', 'plus'],
            description: 'Seat type. "plus" unlocks Sales Navigator actions.',
          },
          billingPeriod: {
            type: 'string',
            enum: ['month', 'year'],
            description: 'Billing period',
          },
        },
        required: ['quantity', 'seatType', 'billingPeriod'],
      },
    };
  }
}
