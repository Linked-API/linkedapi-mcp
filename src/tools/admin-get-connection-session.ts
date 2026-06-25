import {
  LinkedApiAdmin,
  TConnectionSessionResult,
  TGetConnectionSessionParams,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminGetConnectionSessionTool extends AdminTool<
  TGetConnectionSessionParams,
  TConnectionSessionResult
> {
  public readonly name = 'admin_get_connection_session';
  protected readonly schema = z.object({
    sessionId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TGetConnectionSessionParams;
  }): Promise<TConnectionSessionResult> {
    return await admin.accounts.getConnectionSession(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Get connection or reconnection session status by session ID.',
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
