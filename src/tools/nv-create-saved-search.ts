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
    name: z.string().optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Save a Sales Navigator search URL matching the requested type, optionally under a name. Returns its id, name, type and URL. A name already used by a saved search of the same type returns savedSearchAlreadyExists; other errors include savedSearchLimitReached, savedSearchRenameUnconfirmed (saved under its default name, kept) and savedSearchQueryMismatch. Plus required. Returns a workflow acknowledgement; use get_workflow_result with operationName nvCreateSavedSearch.',
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
          name: {
            type: 'string',
            description:
              'Optional name for the saved search: trimmed, single line, 1-256 characters, unique among saved searches of the same type. Omitted, Sales Navigator names it (keywords or "Lead Search 1").',
          },
        },
        required: ['type', 'customSearchUrl'],
      },
    };
  }
}
