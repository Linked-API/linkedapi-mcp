import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TNvFetchCompanyParams } from 'linkedapi-node';

import { nvFetchCompanySchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getNvFetchCompanyTool = (): Tool => ({
  name: 'nv_fetch_company',
  description:
    'Allows you to open a company page in Sales Navigator to retrieve its basic information (nv.openCompanyPage action). Can optionally retrieve employees and decision makers.',
  inputSchema: {
    type: 'object',
    properties: {
      companyHashedUrl: {
        type: 'string',
        description: 'Hashed LinkedIn URL of the company.',
      },
      retrieveEmployees: {
        type: 'boolean',
        description:
          "Optional. Whether to retrieve the company's employees information. Default is false.",
      },
      retrieveDMs: {
        type: 'boolean',
        description:
          "Optional. Whether to retrieve the company's decision makers information. Default is false.",
      },
      employeeRetrievalConfig: {
        type: 'object',
        description:
          'Optional. Configuration for retrieving employees. Available only if retrieveEmployees is true.',
        properties: {
          limit: {
            type: 'number',
            description:
              'Optional. Maximum number of employees to retrieve. Defaults to 500, with a maximum value of 500.',
          },
          filter: {
            type: 'object',
            description:
              'Optional. Object that specifies filtering criteria for employees. When multiple filter fields are specified, they are combined using AND logic.',
            properties: {
              firstName: {
                type: 'string',
                description: 'Optional. First name of employee.',
              },
              lastName: {
                type: 'string',
                description: 'Optional. Last name of employee.',
              },
              positions: {
                type: 'array',
                description:
                  "Optional. Array of job position names. Matches if employee's current position is any of the listed options.",
              },
              locations: {
                type: 'array',
                description:
                  'Optional. Array of free-form strings representing locations. Matches if employee is located in any of the listed locations.',
              },
              industries: {
                type: 'array',
                description:
                  'Optional. Array of enums representing industries. Matches if employee works in any of the listed industries. Takes specific values available in the LinkedIn interface.',
              },
              schools: {
                type: 'array',
                description:
                  'Optional. Array of institution names. Matches if employee currently attends or previously attended any of the listed institutions.',
              },
              yearsOfExperiences: {
                type: 'array',
                description:
                  "Optional. Array of enums representing professional experience. Matches if employee's experience falls within any of the listed ranges.",
                enum: ['lessThanOne', 'oneToTwo', 'threeToFive', 'sixToTen', 'moreThanTen'],
              },
            },
          },
        },
      },
      dmRetrievalConfig: {
        type: 'object',
        description:
          'Optional. Configuration for retrieving decision makers. Available only if retrieveDMs is true.',
        properties: {
          limit: {
            type: 'number',
            description:
              'Optional. Number of decision makers to retrieve. Defaults to 20, with a maximum value of 20. If a company has fewer decision makers than specified, only the available ones will be returned.',
          },
        },
      },
    },
    required: ['companyHashedUrl'],
  },
});

const salesNavigatorFetchCompany = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = nvFetchCompanySchema.parse(args) as TNvFetchCompanyParams;
  const progressToken = 'nv_fetch_company';
  const result = await executeWithProgress(
    progressToken,
    progressCallback,
    linkedapi.nvFetchCompany,
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

export const nvFetchCompanyTool: ToolHandler = {
  tool: getNvFetchCompanyTool(),
  handler: salesNavigatorFetchCompany,
};
