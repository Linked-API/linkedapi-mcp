import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TNvSearchPeopleParams } from 'linkedapi-node';
import { z } from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { OperationTool } from '../linked-api-tool.js';

export class NvSearchPeopleTool extends OperationTool<TNvSearchPeopleParams, unknown> {
  public override readonly name = 'nv_search_people';
  protected override readonly schema = z.object({
    term: z.string().optional(),
    limit: z.number().min(1).max(100).optional(),
    filter: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        position: z.string().optional(),
        locations: z.array(z.string()).optional(),
        industries: z.array(z.string()).optional(),
        currentCompanies: z.array(z.string()).optional(),
        previousCompanies: z.array(z.string()).optional(),
        schools: z.array(z.string()).optional(),
        yearsOfExperiences: z.array(z.string()).optional(),
      })
      .optional(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.nvSearchPeople, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to search people in Sales Navigator applying various filtering criteria. (nv.searchPeople action).',
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
              'Optional. Object that specifies filtering criteria for people. When multiple filter fields are specified, they are combined using AND logic.',
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
              yearsOfExperiences: {
                type: 'array',
                description:
                  "Optional. Array of enums representing professional experience. Matches if person's experience falls within any of the listed ranges.",
                enum: ['lessThanOne', 'oneToTwo', 'threeToFive', 'sixToTen', 'moreThanTen'],
              },
            },
          },
        },
      },
    };
  }
}
