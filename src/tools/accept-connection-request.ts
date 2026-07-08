import { OPERATION_NAME, TAcceptConnectionRequestParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class AcceptConnectionRequestTool extends OperationTool<
  TAcceptConnectionRequestParams,
  unknown
> {
  public override readonly name = 'accept_connection_request';
  public override readonly operationName = OPERATION_NAME.acceptConnectionRequest;
  protected override readonly schema = z.object({
    personUrl: z.string(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to accept an incoming connection request from a person (st.acceptConnectionRequest action). If this workflow is still running, do not retry this tool; retrying can queue duplicate accept attempts for the same person.',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "Public or hashed LinkedIn URL of the person whose connection request you want to accept. (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
