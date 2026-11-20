import { OPERATION_NAME, TNvDeleteListParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvDeleteListTool extends OperationTool<TNvDeleteListParams, void> {
  public override readonly name = 'nv_delete_list' as const;
  public override readonly operationName = OPERATION_NAME.nvDeleteList;
  protected override readonly schema = z.object({
    listId: z.string().min(1),
    unsave: z.enum(['none', 'members']).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Plus-only root action nv.deleteList. Delete one owned list by string listId. By default its members stay saved and in their other lists; unsave "members" also unsaves them, which removes them from your other lists too. Unknown, shared or already-deleted IDs return listNotFound; system lists without a Delete action return listNotDeletable. Success has no result data. Errors also include noSalesNavigator and unexpectedError. Returns a workflow acknowledgement; use get_workflow_result with operationName nvDeleteList.',
      inputSchema: {
        type: 'object',
        properties: {
          listId: {
            type: 'string',
            minLength: 1,
            description: 'Owned list ID as a string, never a number.',
          },
          unsave: {
            type: 'string',
            enum: ['none', 'members'],
            description:
              'What happens to the list members. "none" (default) keeps them saved and in your other lists; "members" also unsaves them, which removes them from your other lists too.',
          },
        },
        required: ['listId'],
      },
    };
  }
}
