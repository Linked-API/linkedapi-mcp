import { OPERATION_NAME } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
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
        'Allows you to retrieve pending connection requests sent from your account. (st.retrievePendingRequests action). Every person in the result carries urn — their permanent LinkedIn member URN (urn:li:member:<id>), or null when LinkedIn does not expose it.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
