import { LinkedApiAdmin, TSetLimitsParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminSetLimitsTool extends AdminTool<TSetLimitsParams, void> {
  public readonly name = 'admin_set_limits';
  protected readonly schema = z.object({
    accountId: z.string(),
    limits: z.array(
      z.object({
        category: z.string(),
        period: z.enum(['daily', 'weekly', 'monthly']),
        maxValue: z.number().int().min(0),
        isEnabled: z.boolean().optional(),
      }),
    ),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TSetLimitsParams;
  }): Promise<void> {
    await admin.limits.set(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Set rate limits for an account. Only specified limits are created or updated; other limits remain unchanged. Categories: stPersonProfileViews, stCompanyPageViews, stConnectionRequests, stMessages, stSearchQueries, stReactions, stComments, stPosts, nvPersonProfileViews, nvCompanyPageViews, nvMessages.',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'Account UUID',
          },
          limits: {
            type: 'array',
            description: 'Array of limit configurations',
            items: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Limit category',
                },
                period: {
                  type: 'string',
                  enum: ['daily', 'weekly', 'monthly'],
                  description: 'Limit period',
                },
                maxValue: {
                  type: 'number',
                  description: 'Maximum allowed actions (>= 0)',
                },
                isEnabled: {
                  type: 'boolean',
                  description: 'Whether this limit is enforced (default: true)',
                },
              },
              required: ['category', 'period', 'maxValue'],
            },
          },
        },
        required: ['accountId', 'limits'],
      },
    };
  }
}
