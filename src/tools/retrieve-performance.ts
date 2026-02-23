import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME } from '@linkedapi/node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class RetrievePerformanceTool extends OperationTool<unknown, unknown> {
  public override readonly name = 'retrieve_performance';
  public override readonly operationName = OPERATION_NAME.retrievePerformance;
  protected override readonly schema = z.object({});

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to retrieve performance analytics from your LinkedIn dashboard (st.retrievePerformance action).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
