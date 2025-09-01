import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class RetrieveSSITool extends OperationTool<unknown, unknown> {
  public override readonly operationName = OPERATION_NAME.retrieveSSI;
  public override readonly name = 'retrieve_ssi';
  protected override readonly schema = z.object({});

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
