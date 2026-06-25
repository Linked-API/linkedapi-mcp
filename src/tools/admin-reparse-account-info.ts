import {
  LinkedApiAdmin,
  TReparseAccountInfoParams,
  TReparseAccountInfoResult,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { AdminTool } from '../utils/admin-tool.js';

export class AdminReparseAccountInfoTool extends AdminTool<
  TReparseAccountInfoParams,
  TReparseAccountInfoResult
> {
  public readonly name = 'admin_reparse_account_info';
  protected readonly schema = z.object({
    accountId: z.string(),
  });

  public override async execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TReparseAccountInfoParams;
  }): Promise<TReparseAccountInfoResult> {
    return await admin.accounts.reparseAccountInfo(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Refresh stored profile information for a connected account. Starts a background reparse workflow and returns workflowId.',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
            description: 'UUID of the account to refresh',
          },
        },
        required: ['accountId'],
      },
    };
  }
}
