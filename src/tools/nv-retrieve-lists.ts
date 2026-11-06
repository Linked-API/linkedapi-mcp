import { OPERATION_NAME, TNvList, TNvRetrieveListsParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvRetrieveListsTool extends OperationTool<TNvRetrieveListsParams, Array<TNvList>> {
  public override readonly name = 'nv_retrieve_lists' as const;
  public override readonly operationName = OPERATION_NAME.nvRetrieveLists;
  protected override readonly schema = z.object({
    type: z.enum(['lead', 'account']),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Plus-only root action nv.retrieveLists. Retrieve every owned Sales Navigator list of the requested type. Results contain id (string), name, type (lead/account), source (open upstream string), entityCount (number or null), and url. Returns a workflow acknowledgement; use get_workflow_result with operationName nvRetrieveLists. Final data is the list array.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['lead', 'account'],
            description: 'Owned list type to retrieve.',
          },
        },
        required: ['type'],
      },
    };
  }
}
