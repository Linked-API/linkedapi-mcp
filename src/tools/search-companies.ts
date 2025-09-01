import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TSearchCompaniesParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class SearchCompaniesTool extends OperationTool<TSearchCompaniesParams, unknown> {
  public override readonly name = 'search_companies';
  public override readonly operationName = OPERATION_NAME.searchCompanies;
  protected override readonly schema = z.object({
    term: z.string().optional(),
    limit: z.number().min(1).max(100).optional(),
    filter: z
      .object({
        locations: z.array(z.string()).optional(),
        industries: z.array(z.string()).optional(),
        sizes: z
          .array(
            z.enum([
              '1-10',
              '11-50',
              '51-200',
              '201-500',
              '501-1000',
              '1001-5000',
              '5001-10000',
              '10001+',
            ]),
          )
          .optional(),
      })
      .optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to search for companies applying various filtering criteria (st.searchCompanies action).',
      inputSchema: {
        type: 'object',
        properties: {
          term: {
            type: 'string',
            description: 'Optional. Keyword or phrase to search.',
          },
          limit: {
            type: 'number',
            description:
              'Optional. Number of search results to return. Defaults to 10, with a maximum value of 100.',
          },
          filter: {
            type: 'object',
            description:
              'Optional. Object that specifies filtering criteria for companies. When multiple filter fields are specified, they are combined using AND logic.',
            properties: {
              sizes: {
                type: 'array',
                description:
                  'Optional. Array of enums representing employee count ranges. Matches if company size falls within any of the listed ranges.',
                enum: [
                  '1-10',
                  '11-50',
                  '51-200',
                  '201-500',
                  '501-1000',
                  '1001-5000',
                  '5001-10000',
                  '10001+',
                ],
              },
              locations: {
                type: 'array',
                description:
                  'Optional. Array of free-form strings representing locations. Matches if company is headquartered in any of the listed locations.',
              },
              industries: {
                type: 'array',
                description:
                  'Optional. Array of enums representing industries. Matches if company works in any of the listed industries. Takes specific values available in the LinkedIn interface.',
              },
            },
          },
        },
      },
    };
  }
}
