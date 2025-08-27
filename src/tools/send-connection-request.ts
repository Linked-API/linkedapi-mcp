import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TSendConnectionRequestParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class SendConnectionRequestTool extends OperationTool<
  TSendConnectionRequestParams,
  unknown
> {
  public override readonly name = 'send_connection_request';
  protected override readonly schema = z.object({
    personUrl: z.string(),
    note: z.string().optional(),
    email: z.string().optional(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.sendConnectionRequest, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to send a connection request to a person (st.sendConnectionRequest action).',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "Public or hashed LinkedIn URL of the person you want to send a connection request to. (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
          note: {
            type: 'string',
            description: 'Optional. Note to include with the connection request.',
          },
          email: {
            type: 'string',
            description:
              'Optional. Email address required by some people for sending connection requests to them. If it is required and not provided, the connection request will fail.',
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
