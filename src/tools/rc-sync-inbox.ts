import { OPERATION_NAME, TRcSyncInboxParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcSyncInboxTool extends OperationTool<TRcSyncInboxParams, unknown> {
  public override readonly name = 'rc_sync_inbox' as const;
  public override readonly operationName = OPERATION_NAME.rcSyncInbox;
  protected override readonly schema = RC_SCHEMAS.rcSyncInbox;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Sync Inbox in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Enable whole-inbox monitoring once per account, then read incoming messages with get_inbox type rc. Only messages arriving after monitoring is enabled are captured. Final result: no result data on success.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
