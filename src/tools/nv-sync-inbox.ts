import { OPERATION_NAME, TNvSyncInboxParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvSyncInboxTool extends OperationTool<TNvSyncInboxParams, unknown> {
  public override readonly name = 'nv_sync_inbox';
  public override readonly operationName = OPERATION_NAME.nvSyncInbox;
  protected override readonly schema = z.object({});

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Enable whole-inbox monitoring in Sales Navigator so every incoming conversation can be polled with get_inbox (nv.syncInbox action). Run once per account; only messages that arrive after it is enabled are captured.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    };
  }
}
