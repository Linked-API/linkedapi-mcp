import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TRetrieveConnectionsParams, TRetrieveConnectionsResult } from 'linkedapi-node';
import { z } from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { OperationTool } from '../linked-api-tool.js';

export class RetrieveConnectionsTool extends OperationTool<
  TRetrieveConnectionsParams,
  TRetrieveConnectionsResult[]
> {
  public override readonly name = 'retrieve_connections';
  protected override readonly schema = z.object({
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
      })
      .optional(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.retrieveConnections, progressCallback);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'allows you to retrieve your connections and perform additional person-related actions if needed (st.retrieveConnections action).',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Optional. Number of connections to return. Defaults to 500, with a maximum value of 1000.',
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
            },
          },
        },
      },
    };
  }
}
