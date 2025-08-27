import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class RetrieveSSITool extends OperationTool<unknown, unknown> {
  public override readonly name = 'retrieve_ssi';
  protected override readonly schema = z.object({});

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.retrieveSSI, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to retrieve your current SSI (Social Selling Index) (st.retrieveSSI action).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
