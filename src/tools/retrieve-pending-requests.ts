import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class RetrievePendingRequestsTool extends OperationTool<unknown, unknown> {
  public override readonly name = 'retrieve_pending_requests';
  protected override readonly schema = z.object({});

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.retrievePendingRequests, progressCallback);
  }

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
