import { OPERATION_NAME, TBaseFetchJobParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class FetchJobTool extends OperationTool<TBaseFetchJobParams, unknown> {
  public override readonly name = 'fetch_job';
  public override readonly operationName = OPERATION_NAME.fetchJob;
  protected override readonly schema = z.object({
    jobUrl: z.string(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Open a LinkedIn job and retrieve its details such as company, location, salary, and description (st.openJob action).',
      inputSchema: {
        type: 'object',
        properties: {
          jobUrl: {
            type: 'string',
            description:
              "LinkedIn URL of the job. (e.g., 'https://www.linkedin.com/jobs/view/4416248954/')",
          },
        },
        required: ['jobUrl'],
      },
    };
  }
}
