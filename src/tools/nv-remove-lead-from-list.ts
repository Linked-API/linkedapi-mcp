import { OPERATION_NAME, TNvRemoveLeadFromListParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvRemoveLeadFromListTool extends OperationTool<TNvRemoveLeadFromListParams, void> {
  public override readonly name = 'nv_remove_lead_from_list' as const;
  public override readonly operationName = OPERATION_NAME.nvRemoveLeadFromList;
  protected override readonly schema = z.object({
    personHashedUrl: z.string().min(1),
    listId: z.string().min(1),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Remove a lead from exactly one owned custom list, keeping it saved and in its other lists. Repeating an absent membership succeeds. English interface only. Plus required. Returns a workflow acknowledgement; use get_workflow_result with operationName nvRemoveLeadFromList.',
      inputSchema: {
        type: 'object',
        properties: {
          personHashedUrl: {
            type: 'string',
            description:
              'Public or hashed LinkedIn person URL, including /in/... and /sales/lead/... or an alert subject URL.',
          },
          listId: {
            type: 'string',
            description: 'Owned list ID as a string, never a number.',
          },
        },
        required: ['personHashedUrl', 'listId'],
      },
    };
  }
}
