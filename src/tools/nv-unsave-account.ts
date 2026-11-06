import { OPERATION_NAME, TNvUnsaveAccountParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvUnsaveAccountTool extends OperationTool<TNvUnsaveAccountParams, void> {
  public override readonly name = 'nv_unsave_account' as const;
  public override readonly operationName = OPERATION_NAME.nvUnsaveAccount;
  protected override readonly schema = z.object({
    companyHashedUrl: z.string().min(1),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Plus-only root action nv.unsaveAccount. Unsave the account only; its saved leads stay saved. Repeating succeeds without changes. Sales Navigator can take up to a few minutes to reflect a change. A call that conflicts with a change you just made through Linked API may fail with unexpectedError; retry it a little later. Returns a workflow acknowledgement; use get_workflow_result with operationName nvUnsaveAccount. Success has no result data.',
      inputSchema: {
        type: 'object',
        properties: {
          companyHashedUrl: {
            type: 'string',
            minLength: 1,
            description:
              'URL accepted by nv.openCompanyPage, including nv.retrieveAlerts subject.url.',
          },
        },
        required: ['companyHashedUrl'],
      },
    };
  }
}
