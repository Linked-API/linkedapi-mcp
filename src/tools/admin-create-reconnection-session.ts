import {
  LinkedApiAdmin,
  TCreateReconnectionSessionParams,
  TCreateReconnectionSessionResult,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminCreateReconnectionSessionTool extends AdminTool<
  TCreateReconnectionSessionParams,
  TCreateReconnectionSessionResult
> {
  public readonly name = 'admin_create_reconnection_session';
  protected readonly schema = z.object({
    accountId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TCreateReconnectionSessionParams;
  }): Promise<TCreateReconnectionSessionResult> {
    return await admin.accounts.createReconnectionSession(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Create a reconnection session for an account with status reconnection_required. Returns reconnectionSessionId and reconnectionLink.',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'UUID of the account to reconnect',
          },
        },
        required: ['accountId'],
      },
    };
  }
}
