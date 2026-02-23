import { OPERATION_NAME, TSendMessageParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class SendMessageTool extends OperationTool<TSendMessageParams, unknown> {
  public override readonly name = 'send_message';
  public override readonly operationName = OPERATION_NAME.sendMessage;
  protected override readonly schema = z.object({
    personUrl: z.string(),
    text: z.string().min(1),
  });

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
