import { OPERATION_NAME, TNvCreatedSavedSearch, TNvCreateSavedSearchParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvCreateSavedSearchTool extends OperationTool<
  TNvCreateSavedSearchParams,
  TNvCreatedSavedSearch
> {
  public override readonly name = 'nv_create_saved_search' as const;
  public override readonly operationName = OPERATION_NAME.nvCreateSavedSearch;
  protected override readonly schema = z.object({
    type: z.enum(['lead', 'account']),
    customSearchUrl: z.string().min(1),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Save a Sales Navigator search URL matching the requested type. Returns its id, name, type and URL. English interface only. Plus required. Returns a workflow acknowledgement; use get_workflow_result with operationName nvCreateSavedSearch.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Sales Navigator subject type.',
            enum: ['lead', 'account'],
          },
          customSearchUrl: {
            type: 'string',
            description:
              'Sales Navigator search URL copied from /sales/search/people for lead or /sales/search/company for account; must match type.',
          },
        },
        required: ['type', 'customSearchUrl'],
      },
    };
  }
}
