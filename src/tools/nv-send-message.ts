import { OPERATION_NAME, TNvSendMessageParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvSendMessageTool extends OperationTool<TNvSendMessageParams, unknown> {
  public override readonly name = 'nv_send_message';
  public override readonly operationName = OPERATION_NAME.nvSendMessage;
  protected override readonly schema = z.object({
    personUrl: z.string().optional(),
    text: z.string().min(1),
    subject: z.string().optional(),
    threadId: z.string().optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to send a message to a person in Sales Navigator (nv.sendMessage action). Provide either personUrl or threadId (threadId replies into an existing conversation thread and takes precedence). If this workflow is still running, do not retry this tool; retrying can send duplicate Sales Navigator messages to the same person.',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "LinkedIn URL of the person you want to send a message to (e.g., 'https://www.linkedin.com/in/john-doe'). Optional if threadId is provided.",
          },
          text: {
            type: 'string',
            description: 'The message text, must be up to 1900 characters.',
          },
          subject: {
            type: 'string',
            description:
              'Subject line, must be up to 80 characters. Required when starting a new conversation; ignored when replying into an existing thread via threadId.',
          },
          threadId: {
            type: 'string',
            description:
              'Optional conversation thread identifier to reply into, as returned by get_inbox. Provide this instead of personUrl to reply directly into a known thread.',
          },
        },
        required: ['text'],
      },
    };
  }
}
