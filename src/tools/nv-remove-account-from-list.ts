import { OPERATION_NAME, TNvRemoveAccountFromListParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvRemoveAccountFromListTool extends OperationTool<
  TNvRemoveAccountFromListParams,
  void
> {
  public override readonly name = 'nv_remove_account_from_list' as const;
  public override readonly operationName = OPERATION_NAME.nvRemoveAccountFromList;
  protected override readonly schema = z.object({
    companyHashedUrl: z.string().min(1),
    listId: z.string().min(1),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Remove an account from exactly one owned custom list, keeping it saved even after its last list. Repeating an absent membership succeeds. English interface only. Plus required. Returns a workflow acknowledgement; use get_workflow_result with operationName nvRemoveAccountFromList.',
      inputSchema: {
        type: 'object',
        properties: {
          companyHashedUrl: {
            type: 'string',
            description:
              'Public or hashed LinkedIn company URL, including /company/... and /sales/company/... or an alert subject URL.',
          },
          listId: {
            type: 'string',
            description: 'Owned list ID as a string, never a number.',
          },
        },
        required: ['companyHashedUrl', 'listId'],
      },
    };
  }
}
