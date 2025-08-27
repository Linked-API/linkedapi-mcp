import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TNvFetchCompanyParams } from 'linkedapi-node';
import { z } from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { OperationTool } from '../linked-api-tool.js';

export class NvFetchCompanyTool extends OperationTool<TNvFetchCompanyParams, unknown> {
  public override readonly name = 'nv_fetch_company';
  protected override readonly schema = z.object({
    companyHashedUrl: z.string(),
    retrieveEmployees: z.boolean().optional().default(false),
    retrieveDMs: z.boolean().optional().default(false),
    employeeRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(500).optional(),
        filter: z
          .object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            positions: z.array(z.string()).optional(),
            locations: z.array(z.string()).optional(),
            industries: z.array(z.string()).optional(),
            schools: z.array(z.string()).optional(),
            yearsOfExperiences: z.array(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),
    dmRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(20).optional(),
      })
      .optional(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.nvFetchCompany, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
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
    };
  }
}
