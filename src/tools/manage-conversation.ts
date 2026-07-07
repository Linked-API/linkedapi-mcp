import { OPERATION_NAME, TManageConversationParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class ManageConversationTool extends OperationTool<TManageConversationParams, unknown> {
  public override readonly name = 'manage_conversation';
  public override readonly operationName = OPERATION_NAME.manageConversation;
  protected override readonly schema = z.object({
    threadId: z.string(),
    operation: z.enum(['archive', 'unarchive', 'star', 'unstar', 'mute', 'unmute']),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Archive, star, or mute a conversation thread by threadId (st.manageConversation action). Provide the threadId as returned by get_inbox and the operation to perform.',
      inputSchema: {
        type: 'object',
        properties: {
          threadId: {
            type: 'string',
            description: 'Conversation thread identifier, as returned by get_inbox.',
          },
          operation: {
            type: 'string',
            description: 'Operation to perform on the conversation thread.',
            enum: ['archive', 'unarchive', 'star', 'unstar', 'mute', 'unmute'],
          },
        },
        required: ['threadId', 'operation'],
      },
    };
  }
}
