import {
  OPERATION_NAME,
  TCheckConnectionStatusParams,
  TCheckConnectionStatusResult,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class CheckConnectionStatusTool extends OperationTool<
  TCheckConnectionStatusParams,
  TCheckConnectionStatusResult
> {
  public override readonly name = 'check_connection_status';
  public override readonly operationName = OPERATION_NAME.checkConnectionStatus;
  protected override readonly schema = z.object({
    personUrl: z.string(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to check the connection status between your account and another person (st.checkConnectionStatus action).',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "Public or hashed LinkedIn URL of the person you want to check the connection status with. (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
