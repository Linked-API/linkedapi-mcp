import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TNvSyncConversationParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvSyncConversationTool extends OperationTool<TNvSyncConversationParams, unknown> {
  public override readonly name = 'nv_sync_conversation';
  public override readonly operationName = OPERATION_NAME.nvSyncConversation;
  protected override readonly schema = z.object({
    personUrl: z.string(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to sync a conversation in Sales Navigator so you can start polling it. (nv.syncConversation action).',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "The LinkedIn URL of the person whose Sales Navigator conversation to sync (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
