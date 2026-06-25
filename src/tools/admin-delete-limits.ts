import { LinkedApiAdmin, TDeleteLimitsParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminDeleteLimitsTool extends AdminTool<TDeleteLimitsParams, void> {
  public readonly name = 'admin_delete_limits';
  protected readonly schema = z.object({
    accountId: z.string(),
    limits: z.array(
      z.object({
        category: z.string(),
        period: z.enum(['daily', 'weekly', 'monthly']),
      }),
    ),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TDeleteLimitsParams;
  }): Promise<void> {
    await admin.limits.delete(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Delete specific rate limits for an account. Deleted limits fall back to system defaults.',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'Account UUID',
          },
          limits: {
            type: 'array',
            description: 'Array of limit keys to delete',
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
              },
              required: ['category', 'period'],
            },
          },
        },
        required: ['accountId', 'limits'],
      },
    };
  }
}
