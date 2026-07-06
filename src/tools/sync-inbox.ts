import { OPERATION_NAME, TSyncInboxParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class SyncInboxTool extends OperationTool<TSyncInboxParams, unknown> {
  public override readonly name = 'sync_inbox';
  public override readonly operationName = OPERATION_NAME.syncInbox;
  protected override readonly schema = z.object({});

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Enable whole-inbox monitoring so every incoming conversation can be polled with get_inbox (st.syncInbox action). Run once per account; only messages that arrive after it is enabled are captured.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    };
  }
}
