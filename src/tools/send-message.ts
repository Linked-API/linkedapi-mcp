import { OPERATION_NAME, TSendMessageParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class SendMessageTool extends OperationTool<TSendMessageParams, unknown> {
  public override readonly name = 'send_message';
  public override readonly operationName = OPERATION_NAME.sendMessage;
  protected override readonly schema = z.object({
    personUrl: z.string().optional(),
    text: z.string().min(1),
    threadId: z.string().optional(),
    manageConversation: z
      .object({
        operation: z.enum(['archive', 'unarchive', 'star', 'unstar', 'mute', 'unmute']),
      })
      .optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to send a message to a person (st.sendMessage action). Provide either personUrl or threadId (threadId replies into an existing conversation thread and takes precedence). Optionally pass manageConversation to archive, star, or mute the conversation right after the message is sent (chained st.manageConversation child, acting on the same thread). If this workflow is still running, do not retry this tool; retrying can send duplicate messages to the same person.',
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
          threadId: {
            type: 'string',
            description:
              'Optional conversation thread identifier to reply into, as returned by get_inbox. Provide this instead of personUrl to reply directly into a known thread.',
          },
          manageConversation: {
            type: 'object',
            description:
              'Optional. Manage the conversation right after the message is sent. Acts on the same thread, so no threadId is needed.',
            properties: {
              operation: {
                type: 'string',
                enum: ['archive', 'unarchive', 'star', 'unstar', 'mute', 'unmute'],
                description: 'Operation to apply to the conversation after sending the message.',
              },
            },
            required: ['operation'],
          },
        },
        required: ['text'],
      },
    };
  }
}
