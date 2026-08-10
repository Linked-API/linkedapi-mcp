import { OPERATION_NAME, TSyncConversationParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class SyncConversationTool extends OperationTool<TSyncConversationParams, unknown> {
  public override readonly name = 'sync_conversation';
  public override readonly operationName = OPERATION_NAME.syncConversation;
  protected override readonly schema = z.object({
    personUrl: z.string(),
    days: z.number().int().min(1).max(90).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to sync a conversation so you can start polling it (st.syncConversation action).',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "The LinkedIn URL of the person whose conversation you want to synchronize (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
          days: {
            type: 'number',
            description:
              'How many days the conversation stays synchronized, from 1 to 90. Defaults to 30. Counted from the moment the action starts running; a reply does not extend it. Syncing the same person again starts a new period and keeps the history already collected.',
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
