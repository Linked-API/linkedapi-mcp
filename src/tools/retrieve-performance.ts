import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class RetrievePerformanceTool extends OperationTool<unknown, unknown> {
  public override readonly name = 'retrieve_performance';
  protected override readonly schema = z.object({});

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.retrievePerformance, progressCallback);
  }

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
