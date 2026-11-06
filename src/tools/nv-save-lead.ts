import { OPERATION_NAME, TNvSaveLeadParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvSaveLeadTool extends OperationTool<TNvSaveLeadParams, void> {
  public override readonly name = 'nv_save_lead' as const;
  public override readonly operationName = OPERATION_NAME.nvSaveLead;
  protected override readonly schema = z.object({
    personHashedUrl: z.string().min(1),
    listId: z.string().min(1).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Plus-only root action nv.saveLead. Ensure a lead is saved; with listId, also ensure membership in that one list, leaving other lists untouched. Without listId, leave lists unchanged. Repeating succeeds without changes. Saving a lead may also save its current company in Sales Navigator. Optional string ID, never a number. Eligible: owned custom lead lists; other targets return listNotFound. Current limitation: If you have more than 10 lead lists, Sales Navigator shows ten lists at a time. If the requested list is not shown, the call fails with unexpectedError. The lead may already be saved, but not added to that list. Sales Navigator can take up to a few minutes to reflect a change. A call that conflicts with a change you just made through Linked API may fail with unexpectedError; retry it a little later. Returns a workflow acknowledgement; use get_workflow_result with operationName nvSaveLead. Success has no result data.',
      inputSchema: {
        type: 'object',
        properties: {
          personHashedUrl: {
            type: 'string',
            minLength: 1,
            description:
              'URL accepted by nv.openPersonPage, including nv.retrieveAlerts subject.url.',
          },
          listId: {
            type: 'string',
            minLength: 1,
            description:
              'Optional string ID, never a number. Eligible: owned custom lead lists; other targets return listNotFound. Current limitation: If you have more than 10 lead lists, Sales Navigator shows ten lists at a time. If the requested list is not shown, the call fails with unexpectedError. The lead may already be saved, but not added to that list.',
          },
        },
        required: ['personHashedUrl'],
      },
    };
  }
}
