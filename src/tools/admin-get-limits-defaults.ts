import { LinkedApiAdmin, TLimit } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetLimitsDefaultsTool extends AdminTool<
  Record<string, never>,
  { limits: Array<TLimit> }
> {
  public readonly name = 'admin_get_limits_defaults';
  protected readonly schema = z.object({});

  public override async execute({
    admin,
  }: {
    admin: LinkedApiAdmin;
    args: Record<string, never>;
  }): Promise<{ limits: Array<TLimit> }> {
    return await admin.limits.getDefaults();
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Get system default rate limits.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
