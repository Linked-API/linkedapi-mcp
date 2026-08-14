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
    location: z.string().optional(),
    allowSimilarResults: z.boolean().optional(),
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
    preferences: z
      .object({
        datePosted: z.enum(['anyTime', 'past24Hours', 'pastWeek', 'pastMonth']).optional(),
        experienceLevels: z
          .array(z.enum(['entryLevel', 'senior', 'manager', 'director', 'executive']))
          .optional(),
        employmentTypes: z
          .array(z.enum(['fullTime', 'partTime', 'contract', 'internship', 'volunteer']))
          .optional(),
        companies: z.array(z.string()).optional(),
        remote: z.boolean().optional(),
        easyApply: z.boolean().optional(),
        under10Applicants: z.boolean().optional(),
        inYourNetwork: z.boolean().optional(),
        keywords: z.array(z.string()).optional(),
      })
      .optional(),
    customSearchUrl: z.string().optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to search jobs applying various filtering criteria (st.searchJobs action). LinkedIn serves either a classic or an AI-powered jobs search, and the two do not offer the same refinements: send filter for the classic one or preferences for the AI-powered one, never both. Every job in the result carries urn — its permanent LinkedIn job posting URN (urn:li:jobPosting:<jobId>), or null when the job id could not be extracted — and isSimilarMatch, telling whether LinkedIn returned it as a near match rather than an exact one.',
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
          location: {
            type: 'string',
            description:
              'Optional. Free-form location string. Applied on both versions of LinkedIn jobs search.',
          },
          allowSimilarResults: {
            type: 'boolean',
            description:
              'Optional. Defaults to true. When false, near matches are excluded from the results, so fewer results than limit may be returned. Only relevant to the AI-powered search.',
          },
          filter: {
            type: 'object',
            description:
              'Optional. Filtering criteria for the classic LinkedIn jobs search. Every specified field is applied, or the action fails. When multiple filter fields are specified, they are combined using AND logic. Mutually exclusive with preferences.',
            properties: {
              location: {
                type: 'string',
                description: 'Optional. Deprecated, use the top-level location instead.',
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
          preferences: {
            type: 'object',
            description:
              "Optional. Filtering criteria for the AI-powered LinkedIn jobs search. LinkedIn decides which of them it offers for a given search, and the ones it does not offer are skipped instead of failing the action. Mutually exclusive with filter. When the account's version of LinkedIn jobs search cannot apply the criteria that were sent, the action fails with searchInterfaceMismatch.",
            properties: {
              datePosted: {
                type: 'string',
                enum: ['anyTime', 'past24Hours', 'pastWeek', 'pastMonth'],
                description: 'Optional. How recently the job was posted.',
              },
              experienceLevels: {
                type: 'array',
                description:
                  'Optional. Array of experience levels, where senior corresponds to midSeniorLevel in filter.',
                items: {
                  type: 'string',
                  enum: ['entryLevel', 'senior', 'manager', 'director', 'executive'],
                },
              },
              employmentTypes: {
                type: 'array',
                description: 'Optional. Array of employment types.',
                items: {
                  type: 'string',
                  enum: ['fullTime', 'partTime', 'contract', 'internship', 'volunteer'],
                },
              },
              companies: {
                type: 'array',
                description: 'Optional. Array of company names.',
                items: { type: 'string' },
              },
              remote: {
                type: 'boolean',
                description:
                  'Optional. When true, only remote jobs. The AI-powered search has no on-site or hybrid equivalent.',
              },
              easyApply: {
                type: 'boolean',
                description: 'Optional. When true, only jobs with Easy Apply.',
              },
              under10Applicants: {
                type: 'boolean',
                description: 'Optional. When true, only jobs with fewer than 10 applicants.',
              },
              inYourNetwork: {
                type: 'boolean',
                description: 'Optional. When true, only jobs from your network.',
              },
              keywords: {
                type: 'array',
                description:
                  'Optional. Array of free-form skills, technologies or topics to narrow the search by, such as AWS or Fintech. LinkedIn suggests a different set for every search.',
                items: { type: 'string' },
              },
            },
          },
          customSearchUrl: {
            type: 'string',
            description:
              'Optional. URL copied from a LinkedIn jobs search page. When specified, overrides term, location, filter and preferences.',
          },
        },
      },
    };
  }
}
