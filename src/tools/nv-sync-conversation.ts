import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TNvSyncConversationParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class NvSyncConversationTool extends OperationTool<TNvSyncConversationParams, unknown> {
  public override readonly name = 'nv_sync_conversation';
  protected override readonly schema = z.object({
    personUrl: z.string(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.nvSyncConversation, progressCallback);
  }

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
