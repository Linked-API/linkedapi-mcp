import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TRemoveConnectionParams } from 'linkedapi-node';
import { z } from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { OperationTool } from '../linked-api-tool.js';

export class RemoveConnectionTool extends OperationTool<TRemoveConnectionParams, unknown> {
  public override readonly name = 'remove_connection';
  protected override readonly schema = z.object({
    personUrl: z.string(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.removeConnection, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to remove a person from your connections (st.removeConnection action).',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "Public or hashed LinkedIn URL of the person you want to remove from your connections. (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
