import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TNvOpenPersonPageParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvFetchPersonTool extends OperationTool<TNvOpenPersonPageParams, unknown> {
  public override readonly name = 'nv_fetch_person';
  public override readonly operationName = OPERATION_NAME.nvFetchPerson;
  protected override readonly schema = z.object({
    personHashedUrl: z.string(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to open a person page in Sales Navigator to retrieve their basic information (nv.openPersonPage action).',
      inputSchema: {
        type: 'object',
        properties: {
          personHashedUrl: {
            type: 'string',
            description: 'Hashed LinkedIn URL of the person.',
          },
        },
        required: ['personHashedUrl'],
      },
    };
  }
}
