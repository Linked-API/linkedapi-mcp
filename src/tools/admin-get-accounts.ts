import { LinkedApiAdmin, TAccountsResult } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetAccountsTool extends AdminTool<Record<string, never>, TAccountsResult> {
  public readonly name = 'admin_get_accounts';
  protected readonly schema = z.object({});

  public override async execute({
    admin,
  }: {
    admin: LinkedApiAdmin;
    args: Record<string, never>;
  }): Promise<TAccountsResult> {
    return await admin.accounts.getAll();
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Get all connected LinkedIn accounts and pending connection sessions.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
