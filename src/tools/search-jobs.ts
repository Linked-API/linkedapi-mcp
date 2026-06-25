import { OPERATION_NAME, TSearchJobsParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class SearchJobsTool extends OperationTool<TSearchJobsParams, unknown> {
  public override readonly name = 'search_jobs';
  public override readonly operationName = OPERATION_NAME.searchJobs;
  protected override readonly schema = z.object({
    term: z.string().optional(),
    limit: z.number().min(1).max(1000).optional(),
    filter: z
      .object({
        location: z.string().optional(),
        datePosted: z.enum(['anyTime', 'past24Hours', 'pastWeek', 'pastMonth']).optional(),
        experienceLevels: z
          .array(
            z.enum([
              'internship',
              'entryLevel',
              'associate',
              'midSeniorLevel',
              'director',
              'executive',
            ]),
          )
          .optional(),
        employmentTypes: z
          .array(
            z.enum([
              'fullTime',
              'partTime',
              'contract',
              'temporary',
              'volunteer',
              'internship',
              'other',
            ]),
          )
          .optional(),
        workplaceTypes: z.array(z.enum(['onSite', 'remote', 'hybrid'])).optional(),
        companies: z.array(z.string()).optional(),
        industries: z.array(z.string()).optional(),
        jobFunctions: z.array(z.string()).optional(),
        easyApply: z.boolean().optional(),
        hasVerifications: z.boolean().optional(),
        under10Applicants: z.boolean().optional(),
        inYourNetwork: z.boolean().optional(),
        fairChanceEmployer: z.boolean().optional(),
      })
      .optional(),
    customSearchUrl: z.string().optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to search jobs applying various filtering criteria (st.searchJobs action).',
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
              'Optional. Number of search results to return. Defaults to 10, with a maximum value of 1000.',
          },
          filter: {
            type: 'object',
            description:
              'Optional. Object that specifies filtering criteria for jobs. When multiple filter fields are specified, they are combined using AND logic.',
            properties: {
              location: {
                type: 'string',
                description: 'Optional. Free-form location string.',
              },
              datePosted: {
                type: 'string',
                enum: ['anyTime', 'past24Hours', 'pastWeek', 'pastMonth'],
                description: 'Optional. How recently the job was posted.',
              },
              experienceLevels: {
                type: 'array',
                description: 'Optional. Array of experience levels.',
                items: {
                  type: 'string',
                  enum: [
                    'internship',
                    'entryLevel',
                    'associate',
                    'midSeniorLevel',
                    'director',
                    'executive',
                  ],
                },
              },
              employmentTypes: {
                type: 'array',
                description: 'Optional. Array of employment types.',
                items: {
                  type: 'string',
                  enum: [
                    'fullTime',
                    'partTime',
                    'contract',
                    'temporary',
                    'volunteer',
                    'internship',
                    'other',
                  ],
                },
              },
              workplaceTypes: {
                type: 'array',
                description: 'Optional. Array of workplace types.',
                items: {
                  type: 'string',
                  enum: ['onSite', 'remote', 'hybrid'],
                },
              },
              companies: {
                type: 'array',
                description: 'Optional. Array of company names.',
                items: { type: 'string' },
              },
              industries: {
                type: 'array',
                description: 'Optional. Array of industry names.',
                items: { type: 'string' },
              },
              jobFunctions: {
                type: 'array',
                description: 'Optional. Array of job function names.',
                items: { type: 'string' },
              },
              easyApply: {
                type: 'boolean',
                description: 'Optional. When true, only jobs with Easy Apply.',
              },
              hasVerifications: {
                type: 'boolean',
                description: 'Optional. When true, only jobs with verification signals.',
              },
              under10Applicants: {
                type: 'boolean',
                description: 'Optional. When true, only jobs with fewer than 10 applicants.',
              },
              inYourNetwork: {
                type: 'boolean',
                description: 'Optional. When true, only jobs from your network.',
              },
              fairChanceEmployer: {
                type: 'boolean',
                description: 'Optional. When true, only fair chance employer jobs.',
              },
            },
          },
          customSearchUrl: {
            type: 'string',
            description:
              'Optional. URL copied from a LinkedIn jobs search page. When specified, overrides term and filter.',
          },
        },
      },
    };
  }
}
