import { OPERATION_NAME, TRemoveConnectionParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class RemoveConnectionTool extends OperationTool<TRemoveConnectionParams, unknown> {
  public override readonly name = 'remove_connection';
  public override readonly operationName = OPERATION_NAME.removeConnection;
  protected override readonly schema = z.object({
    personUrl: z.string(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to remove a person from your connections (st.removeConnection action). If this workflow is still running, do not retry this tool; retrying can queue duplicate removal attempts for the same person.',
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
