import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME } from '@linkedapi/node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class RetrievePendingRequestsTool extends OperationTool<unknown, unknown> {
  public override readonly name = 'retrieve_pending_requests';
  public override readonly operationName = OPERATION_NAME.retrievePendingRequests;
  protected override readonly schema = z.object({});

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to retrieve pending connection requests sent from your account. (st.retrievePendingRequests action).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
