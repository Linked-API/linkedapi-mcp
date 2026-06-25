import { LinkedApiAdmin, TCancelConnectionSessionParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminCancelConnectionSessionTool extends AdminTool<
  TCancelConnectionSessionParams,
  void
> {
  public readonly name = 'admin_cancel_connection_session';
  protected readonly schema = z.object({
    sessionId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TCancelConnectionSessionParams;
  }): Promise<void> {
    await admin.accounts.cancelConnectionSession(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Cancel a pending connection or reconnection session.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'Connection session UUID',
          },
        },
        required: ['sessionId'],
      },
    };
  }
}
