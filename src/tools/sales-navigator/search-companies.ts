import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TNvSearchCompaniesParams } from 'linkedapi-node';

import { nvSearchCompaniesSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getNvSearchCompaniesTool = (): Tool => ({
  name: 'nv_search_companies',
  description:
    'Allows you to search for companies in Sales Navigator applying various filtering criteria. (nv.searchCompanies action).',
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
          annualRevenue: {
            type: 'object',
            description:
              'Optional. Object representing company annual revenue range in million USD.',
            properties: {
              min: {
                type: 'string',
                enum: ['0', '0.5', '1', '2.5', '5', '10', '20', '50', '100', '500', '1000'],
              },
              max: {
                type: 'string',
                enum: ['0.5', '1', '2.5', '5', '10', '20', '50', '100', '500', '1000', '1000+'],
              },
            },
          },
        },
      },
    },
  },
});

const salesNavigatorSearchCompanies = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = nvSearchCompaniesSchema.parse(args) as TNvSearchCompaniesParams;
  const progressToken = 'nv_search_companies';
  const result = await executeWithProgress(
    progressToken,
    progressCallback,
    linkedapi.nvSearchCompanies,
    params,
  );
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const nvSearchCompaniesTool: ToolHandler = {
  tool: getNvSearchCompaniesTool(),
  handler: salesNavigatorSearchCompanies,
};
