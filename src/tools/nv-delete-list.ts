import { OPERATION_NAME, TNvDeleteListParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvDeleteListTool extends OperationTool<TNvDeleteListParams, void> {
  public override readonly name = 'nv_delete_list' as const;
  public override readonly operationName = OPERATION_NAME.nvDeleteList;
  protected override readonly schema = z.object({
    listId: z.string().min(1),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Plus-only root action nv.deleteList. Delete one owned list by string listId, keeping members saved and in their other lists. Unknown, shared or already-deleted IDs return listNotFound; system lists without a Delete action return listNotDeletable. Success has no result data. English interface only; errors also include interfaceLanguageNotSupported, noSalesNavigator and unexpectedError. Returns a workflow acknowledgement; use get_workflow_result with operationName nvDeleteList.',
      inputSchema: {
        type: 'object',
        properties: {
          listId: {
            type: 'string',
            minLength: 1,
            description:
              'Owned list ID as a string, never a number. Members stay saved and in their other lists.',
          },
        },
        required: ['listId'],
      },
    };
  }
}
