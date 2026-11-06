import { OPERATION_NAME, TNvSaveAccountParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvSaveAccountTool extends OperationTool<TNvSaveAccountParams, void> {
  public override readonly name = 'nv_save_account' as const;
  public override readonly operationName = OPERATION_NAME.nvSaveAccount;
  protected override readonly schema = z.object({
    companyHashedUrl: z.string().min(1),
    listId: z.string().min(1).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Plus-only root action nv.saveAccount. Ensure an account is saved; with listId, also ensure membership in that one list, leaving other lists untouched. Without listId, leave lists unchanged. Repeating succeeds without changes. Optional string ID, never a number. Eligible: owned custom account lists or My Current Accounts; other targets return listNotFound. Current limitation: If you have more than 10 account lists, Sales Navigator shows ten lists at a time. If the requested list is not shown, the call fails with unexpectedError. The account may already be saved, but not added to that list. Sales Navigator can take up to a few minutes to reflect a change. A call that conflicts with a change you just made through Linked API may fail with unexpectedError; retry it a little later. Returns a workflow acknowledgement; use get_workflow_result with operationName nvSaveAccount. Success has no result data.',
      inputSchema: {
        type: 'object',
        properties: {
          companyHashedUrl: {
            type: 'string',
            minLength: 1,
            description:
              'URL accepted by nv.openCompanyPage, including nv.retrieveAlerts subject.url.',
          },
          listId: {
            type: 'string',
            minLength: 1,
            description:
              'Optional string ID, never a number. Eligible: owned custom account lists or My Current Accounts; other targets return listNotFound. Current limitation: If you have more than 10 account lists, Sales Navigator shows ten lists at a time. If the requested list is not shown, the call fails with unexpectedError. The account may already be saved, but not added to that list.',
          },
        },
        required: ['companyHashedUrl'],
      },
    };
  }
}
