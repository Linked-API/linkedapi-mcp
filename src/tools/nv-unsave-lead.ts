import { OPERATION_NAME, TNvUnsaveLeadParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvUnsaveLeadTool extends OperationTool<TNvUnsaveLeadParams, void> {
  public override readonly name = 'nv_unsave_lead' as const;
  public override readonly operationName = OPERATION_NAME.nvUnsaveLead;
  protected override readonly schema = z.object({
    personHashedUrl: z.string().min(1),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        "Plus-only root action nv.unsaveLead. Use Sales Navigator's native unsave: the lead is no longer saved and leaves every custom list the user owns. Repeating succeeds without changes. Sales Navigator can take up to a few minutes to reflect a change. A call that conflicts with a change you just made through Linked API may fail with unexpectedError; retry it a little later. Returns a workflow acknowledgement; use get_workflow_result with operationName nvUnsaveLead. Success has no result data.",
      inputSchema: {
        type: 'object',
        properties: {
          personHashedUrl: {
            type: 'string',
            minLength: 1,
            description:
              'URL accepted by nv.openPersonPage, including nv.retrieveAlerts subject.url.',
          },
        },
        required: ['personHashedUrl'],
      },
    };
  }
}
