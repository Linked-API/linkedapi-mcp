import { OPERATION_NAME, TNvManageConversationParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvManageConversationTool extends OperationTool<TNvManageConversationParams, unknown> {
  public override readonly name = 'nv_manage_conversation';
  public override readonly operationName = OPERATION_NAME.nvManageConversation;
  protected override readonly schema = z.object({
    threadId: z.string(),
    operation: z.enum(['archive', 'unarchive']),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Archive or unarchive a Sales Navigator conversation thread by threadId (nv.manageConversation action). Provide the threadId as returned by get_inbox and the operation to perform.',
      inputSchema: {
        type: 'object',
        properties: {
          threadId: {
            type: 'string',
            description: 'Conversation thread identifier, as returned by get_inbox.',
          },
          operation: {
            type: 'string',
            description: 'Operation to perform on the Sales Navigator conversation thread.',
            enum: ['archive', 'unarchive'],
          },
        },
        required: ['threadId', 'operation'],
      },
    };
  }
}
