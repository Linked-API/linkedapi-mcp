import { OPERATION_NAME } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class RetrieveConnectionRequestsTool extends OperationTool<unknown, unknown> {
  public override readonly name = 'retrieve_connection_requests';
  public override readonly operationName = OPERATION_NAME.retrieveConnectionRequests;
  protected override readonly schema = z.object({});

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to retrieve incoming connection requests received by your account. (st.retrieveConnectionRequests action).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
