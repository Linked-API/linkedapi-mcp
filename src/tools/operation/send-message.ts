import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TSendMessageParams } from 'linkedapi-node';
import { z } from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { OperationTool } from '../linked-api-tool.js';

export class SendMessageTool extends OperationTool<TSendMessageParams, unknown> {
  public override readonly name = 'send_message';
  protected override readonly schema = z.object({
    personUrl: z.string(),
    text: z.string().min(1),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.sendMessage, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Allows you to send a message to a person (st.sendMessage action).',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "LinkedIn URL of the person you want to send a message to (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
          text: {
            type: 'string',
            description: 'The message text, must be up to 1900 characters.',
          },
        },
        required: ['personUrl', 'text'],
      },
    };
  }
}
