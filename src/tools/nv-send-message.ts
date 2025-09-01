import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TNvSendMessageParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvSendMessageTool extends OperationTool<TNvSendMessageParams, unknown> {
  public override readonly name = 'nv_send_message';
  public override readonly operationName = OPERATION_NAME.nvSendMessage;
  protected override readonly schema = z.object({
    personUrl: z.string(),
    text: z.string().min(1),
    subject: z.string().optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to send a message to a person in Sales Navigator (nv.sendMessage action)',
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
          subject: {
            type: 'string',
            description: 'Subject line, must be up to 80 characters.',
          },
        },
        required: ['personUrl', 'text', 'subject'],
      },
    };
  }
}
