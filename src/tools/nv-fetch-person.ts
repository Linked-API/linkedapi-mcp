import { OPERATION_NAME, TNvOpenPersonPageParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
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
        "Allows you to open a person page in Sales Navigator to retrieve their basic information (nv.openPersonPage action). The result carries urn — the person's permanent LinkedIn member URN (urn:li:member:<id>) — and companyUrn for their current company (urn:li:organization:<id>); either is null when LinkedIn does not expose it. The same person carries the same urn in standard interface results, so it can be used to match Sales Navigator results against them.",
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
