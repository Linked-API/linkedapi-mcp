import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TNvOpenPersonPageParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class NvFetchPersonTool extends OperationTool<TNvOpenPersonPageParams, unknown> {
  public override readonly name = 'nv_fetch_person';
  protected override readonly schema = z.object({
    personHashedUrl: z.string(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.nvFetchPerson, progressCallback);
  }

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
