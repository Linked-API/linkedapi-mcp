import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TSyncConversationParams } from 'linkedapi-node';
import { z } from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { OperationTool } from '../linked-api-tool.js';

export class SyncConversationTool extends OperationTool<TSyncConversationParams, unknown> {
  public override readonly name = 'sync_conversation';
  protected override readonly schema = z.object({
    personUrl: z.string(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.syncConversation, progressCallback);
  }

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
