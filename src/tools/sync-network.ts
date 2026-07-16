import { OPERATION_NAME, TSyncNetworkParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class SyncNetworkTool extends OperationTool<TSyncNetworkParams, unknown> {
  public override readonly name = 'sync_network';
  public override readonly operationName = OPERATION_NAME.syncNetwork;
  protected override readonly schema = z.object({});

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Enable background network monitoring so connection events can be polled with get_network (st.syncNetwork action). Run once per account; only changes that happen after it is enabled are captured.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    };
  }
}
