import { OPERATION_NAME, TNvRetrieveSavedSearchesParams, TNvSavedSearch } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvRetrieveSavedSearchesTool extends OperationTool<
  TNvRetrieveSavedSearchesParams,
  Array<TNvSavedSearch>
> {
  public override readonly name = 'nv_retrieve_saved_searches' as const;
  public override readonly operationName = OPERATION_NAME.nvRetrieveSavedSearches;
  protected override readonly schema = z.object({
    type: z.enum(['lead', 'account']),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Retrieve owned saved searches of the requested type. Plus required. Returns a workflow acknowledgement; use get_workflow_result with operationName nvRetrieveSavedSearches.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Sales Navigator subject type.',
            enum: ['lead', 'account'],
          },
        },
        required: ['type'],
      },
    };
  }
}
