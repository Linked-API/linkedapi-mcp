import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TWithdrawConnectionRequestParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class WithdrawConnectionRequestTool extends OperationTool<
  TWithdrawConnectionRequestParams,
  unknown
> {
  public override readonly name = 'withdraw_connection_request';
  public override readonly operationName = OPERATION_NAME.withdrawConnectionRequest;
  protected override readonly schema = z.object({
    personUrl: z.string(),
    unfollow: z.boolean().optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to withdraw the connection request sent to a person (st.withdrawConnectionRequest action).',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "Public or hashed LinkedIn URL of the person you want to withdraw the connection request from. (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
          unfollow: {
            type: 'boolean',
            description:
              'Optional. Boolean indicating whether you want to unfollow the person when withdrawing the request. The default value is true.',
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
