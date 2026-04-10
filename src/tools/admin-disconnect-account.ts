import { LinkedApiAdmin, TDisconnectParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminDisconnectAccountTool extends AdminTool<TDisconnectParams, void> {
  public readonly name = 'admin_disconnect_account';
  protected readonly schema = z.object({
    accountId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TDisconnectParams;
  }): Promise<void> {
    await admin.accounts.disconnect(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Disconnect a LinkedIn account. This action is irreversible — the account must be reconnected from scratch.',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'UUID of the account to disconnect',
          },
        },
        required: ['accountId'],
      },
    };
  }
}
