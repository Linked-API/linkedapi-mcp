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
        "Loads this person's earlier message history (st.syncConversation action). Call once per person; repeating it within 24 hours returns quickly. Do not call it to check for new messages – use get_inbox. After it completes, read the history with get_inbox and personUrl.",
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "The LinkedIn URL of the person whose message history you want to load (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
          days: {
            type: 'number',
            description:
              'Syncing period, not the depth of history: how many days new messages keep being added to the loaded history, from 1 to 90. Defaults to 30. The whole conversation is read regardless. Counted from the moment the action starts running; a reply does not extend it. Syncing the same person again keeps the history already collected and never shortens the period.',
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
