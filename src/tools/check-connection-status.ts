import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, {
  TCheckConnectionStatusParams,
  TCheckConnectionStatusResult,
} from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class CheckConnectionStatusTool extends OperationTool<
  TCheckConnectionStatusParams,
  TCheckConnectionStatusResult
> {
  public override readonly name = 'check_connection_status';
  protected override readonly schema = z.object({
    personUrl: z.string(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.checkConnectionStatus, progressCallback);
  }

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
