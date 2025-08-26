import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TSearchPeopleParams } from 'linkedapi-node';

import { searchPeopleSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ProgressNotification, ToolHandler } from '../../types/index.js';
import { executeWithProgress } from '../../utils/execute-with-progress.js';

const getSearchPeopleTool = (): Tool => ({
  name: 'search_people',
  description:
    'Allows you to search people applying various filtering criteria (st.searchPeople action).',
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
          'Optional. Object that specifi es filtering criteria for people. When multiple filter fields are specified, they are combined using AND logic.',
        properties: {
          firstName: {
            type: 'string',
            description: 'Optional. First name of person.',
          },
          lastName: {
            type: 'string',
            description: 'Optional. Last name of person.',
          },
          position: {
            type: 'string',
            description: 'Optional. Job position of person.',
          },
          locations: {
            type: 'array',
            description:
              'Optional. Array of free-form strings representing locations. Matches if person is located in any of the listed locations.',
          },
          industries: {
            type: 'array',
            description:
              'Optional. Array of enums representing industries. Matches if person works in any of the listed industries. Takes specific values available in the LinkedIn interface.',
          },
          currentCompanies: {
            type: 'array',
            description:
              'Optional. Array of company names. Matches if person currently works at any of the listed companies.',
          },
          previousCompanies: {
            type: 'array',
            description:
              'Optional. Array of company names. Matches if person previously worked at any of the listed companies.',
          },
          schools: {
            type: 'array',
            description:
              'Optional. Array of institution names. Matches if person currently attends or previously attended any of the listed institutions.',
          },
        },
      },
    },
  },
});

const searchPeople = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = searchPeopleSchema.parse(args) as TSearchPeopleParams;
  const progressToken = 'search_people';
  const result = await executeWithProgress(
    progressToken,
    progressCallback,
    linkedapi.searchPeople,
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

export const searchPeopleTool: ToolHandler = {
  tool: getSearchPeopleTool(),
  handler: searchPeople,
};
