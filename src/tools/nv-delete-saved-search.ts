import { OPERATION_NAME, TNvDeleteSavedSearchParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvDeleteSavedSearchTool extends OperationTool<TNvDeleteSavedSearchParams, void> {
  public override readonly name = 'nv_delete_saved_search' as const;
  public override readonly operationName = OPERATION_NAME.nvDeleteSavedSearch;
  protected override readonly schema = z.object({
    savedSearchId: z.string().regex(/^[1-9]\d*$/),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Delete an owned saved search by its string ID. An absent search returns savedSearchNotFound. English interface only. Plus required. Returns a workflow acknowledgement; use get_workflow_result with operationName nvDeleteSavedSearch.',
      inputSchema: {
        type: 'object',
        properties: {
          savedSearchId: {
            type: 'string',
            description: 'Owned saved-search ID as a positive decimal string.',
            pattern: '^[1-9]\\d*$',
          },
        },
        required: ['savedSearchId'],
      },
    };
  }
}
