import { OPERATION_NAME, TNvListLead, TNvRetrieveListLeadsParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvRetrieveListLeadsTool extends OperationTool<
  TNvRetrieveListLeadsParams,
  Array<TNvListLead>
> {
  public override readonly name = 'nv_retrieve_list_leads' as const;
  public override readonly operationName = OPERATION_NAME.nvRetrieveListLeads;
  protected override readonly schema = z.object({
    listId: z.string().min(1),
    limit: z.number().int().min(1).max(1000).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Retrieve list leads from an owned Sales Navigator list. Plus required. Returns a workflow acknowledgement; use get_workflow_result with operationName nvRetrieveListLeads.',
      inputSchema: {
        type: 'object',
        properties: {
          listId: {
            type: 'string',
            description: 'Owned list ID as a string, never a number.',
          },
          limit: {
            type: 'integer',
            description: 'Maximum matching members, 1–1000; default 25.',
            minimum: 1,
            maximum: 1000,
            default: 25,
          },
        },
        required: ['listId'],
      },
    };
  }
}
