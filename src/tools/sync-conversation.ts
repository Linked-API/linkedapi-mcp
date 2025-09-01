import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TSyncConversationParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class SyncConversationTool extends OperationTool<TSyncConversationParams, unknown> {
  public override readonly name = 'sync_conversation';
  public override readonly operationName = OPERATION_NAME.syncConversation;
  protected override readonly schema = z.object({
    personUrl: z.string(),
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
        },
        required: ['personUrl'],
      },
    };
  }
}
