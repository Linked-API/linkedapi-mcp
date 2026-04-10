import { LinkedApiAdmin, TCreateConnectionSessionResult } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminConnectAccountTool extends AdminTool<
  Record<string, never>,
  TCreateConnectionSessionResult
> {
  public readonly name = 'admin_connect_account';
  protected readonly schema = z.object({});

  public override async execute({
    admin,
  }: {
    admin: LinkedApiAdmin;
    args: Record<string, never>;
  }): Promise<TCreateConnectionSessionResult> {
    return await admin.accounts.createConnectionSession();
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Create a connection session to connect a new LinkedIn account. Returns a sessionId and connectionLink that must be opened in a browser.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
