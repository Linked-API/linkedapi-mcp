import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TFetchCompanyParams } from 'linkedapi-node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class FetchCompanyTool extends OperationTool<TFetchCompanyParams, unknown> {
  public override readonly name = 'fetch_company';
  protected override readonly schema = z.object({
    companyUrl: z.string(),
    retrieveEmployees: z.boolean().optional().default(false),
    retrievePosts: z.boolean().optional().default(false),
    retrieveDMs: z.boolean().optional().default(false),
    postRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(20).optional(),
        since: z.string().optional(),
      })
      .optional(),
    dmRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(20).optional(),
      })
      .optional(),
    employeeRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(500).optional(),
        filter: z
          .object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            position: z.string().optional(),
            locations: z.array(z.string()).optional(),
            industries: z.array(z.string()).optional(),
            schools: z.array(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.fetchCompany, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to open a company page to retrieve its basic information (st.openCompanyPage action). Can optionally retrieve employees, posts and decision makers.',
      inputSchema: {
        type: 'object',
        properties: {
          companyUrl: {
            type: 'string',
            description:
              "Public or hashed LinkedIn URL of the company. (e.g., 'https://www.linkedin.com/company/microsoft')",
          },
          retrieveEmployees: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the company's employees information. Default is false.",
          },
          retrievePosts: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the company's posts information. Default is false.",
          },
          retrieveDMs: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the company's decision makers information. Default is false.",
          },
          postRetrievalConfig: {
            type: 'object',
            description:
              'Optional. Configuration for retrieving posts. Available only if retrievePosts is true.',
            properties: {
              limit: {
                type: 'number',
                description:
                  'Optional. Number of posts to retrieve. Defaults to 20, with a maximum value of 20.',
              },
              since: {
                type: 'string',
                description:
                  'Optional. ISO 8601 timestamp to filter posts published after the specified time.',
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
                  position: {
                    type: 'string',
                    description: 'Optional. Job position of employee.',
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
                },
              },
            },
          },
        },
        required: ['companyUrl'],
      },
    };
  }
}
