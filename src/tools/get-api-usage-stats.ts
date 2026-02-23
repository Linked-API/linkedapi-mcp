import LinkedApi, { TApiUsageAction, TApiUsageParams, TMappedResponse } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class GetApiUsageTool extends LinkedApiTool<TApiUsageParams, TApiUsageAction[]> {
  public readonly name = 'get_api_usage';
  protected readonly schema = z.object({
    start: z.string(),
    end: z.string(),
  });

  public override async execute({
    linkedapi,
    args,
  }: {
    linkedapi: LinkedApi;
    args: TApiUsageParams;
    workflowTimeout: number;
    progressToken?: string | number;
  }): Promise<TMappedResponse<TApiUsageAction[]>> {
    return await linkedapi.getApiUsage(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Retrieve Linked API usage statistics. Date range must not exceed 30 days.',
      inputSchema: {
        type: 'object',
        properties: {
          start: {
            type: 'string',
            description:
              "Start date for the statistics period in ISO 8601 format (e.g., '2024-01-01T00:00:00Z')",
          },
          end: {
            type: 'string',
            description:
              "End date for the statistics period in ISO 8601 format (e.g., '2024-01-30T00:00:00Z')",
          },
        },
        required: ['start', 'end'],
      },
    };
  }
}
