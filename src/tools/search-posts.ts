import { OPERATION_NAME, TSearchPostsParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

const PERSON_FILTER_ENTRY_SCHEMA = z.union([
  z.string().min(1).max(100),
  z.object({
    name: z.string().min(1).max(100),
    urn: z.string().optional(),
    personHashedUrl: z.string().optional(),
  }),
]);

const COMPANY_FILTER_ENTRY_SCHEMA = z.union([
  z.string().min(1).max(100),
  z.object({
    name: z.string().min(1).max(100),
    urn: z.string().optional(),
    companyHashedUrl: z.string().optional(),
  }),
]);

const PERSON_FILTER_ENTRY_JSON_SCHEMA = {
  oneOf: [
    {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Name of the person, shorthand for { name }.',
    },
    {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Required. Name to type into the LinkedIn filter panel.',
        },
        urn: {
          type: 'string',
          description: 'Optional. Member URN of the person, urn:li:member:<id>.',
        },
        personHashedUrl: {
          type: 'string',
          description: 'Optional. Hashed LinkedIn URL of the person.',
        },
      },
      required: ['name'],
    },
  ],
};

const COMPANY_FILTER_ENTRY_JSON_SCHEMA = {
  oneOf: [
    {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Name of the company, shorthand for { name }.',
    },
    {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Required. Name to type into the LinkedIn filter panel.',
        },
        urn: {
          type: 'string',
          description: 'Optional. Organization URN of the company, urn:li:organization:<id>.',
        },
        companyHashedUrl: {
          type: 'string',
          description: 'Optional. Hashed LinkedIn URL of the company.',
        },
      },
      required: ['name'],
    },
  ],
};

export class SearchPostsTool extends OperationTool<TSearchPostsParams, unknown> {
  public override readonly name = 'search_posts';
  public override readonly operationName = OPERATION_NAME.searchPosts;
  protected override readonly schema = z
    .object({
      term: z.string().min(1).max(50).optional(),
      limit: z.number().min(1).max(100).optional(),
      filter: z
        .object({
          sort: z.enum(['topMatch', 'latest']).optional(),
          datePosted: z.enum(['past24Hours', 'pastWeek', 'pastMonth']).optional(),
          contentType: z
            .enum(['videos', 'images', 'jobPosts', 'liveVideos', 'documents'])
            .optional(),
          postedBy: z.array(z.enum(['me', 'firstConnections', 'peopleYouFollow'])).optional(),
          fromMembers: z.array(PERSON_FILTER_ENTRY_SCHEMA).optional(),
          fromCompanies: z.array(COMPANY_FILTER_ENTRY_SCHEMA).optional(),
          mentioningMembers: z.array(PERSON_FILTER_ENTRY_SCHEMA).optional(),
          mentioningCompanies: z.array(COMPANY_FILTER_ENTRY_SCHEMA).optional(),
          authorCompanies: z.array(COMPANY_FILTER_ENTRY_SCHEMA).optional(),
          authorIndustries: z.array(z.string()).optional(),
        })
        .optional(),
      customSearchUrl: z.string().optional(),
    })
    .refine(({ term, customSearchUrl }) => Boolean(term) || Boolean(customSearchUrl), {
      message: 'Either term or customSearchUrl must be provided.',
    });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to search posts applying various filtering criteria (st.searchPosts action). Either term or customSearchUrl must be provided, and when customSearchUrl is specified, filter is ignored entirely and only the facets already encoded in the URL are applied. LinkedIn widens a narrow query on its own, so a non-empty result does not mean the term matched — check the returned posts against your own criteria when an exact match matters. Unlike fetch_post, the author and reposter of a search result carry no urn, so fetch the post by its url when you need one.',
      inputSchema: {
        type: 'object',
        properties: {
          term: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description:
              'Optional. Keyword or phrase to search, from 1 to 50 characters. Required unless customSearchUrl is specified.',
          },
          limit: {
            type: 'number',
            description:
              'Optional. Number of search results to return. Defaults to 10, with a maximum value of 100. A search may return fewer posts than limit, because how many results come back depends on what LinkedIn loads for that account on that search.',
          },
          filter: {
            type: 'object',
            description:
              'Optional. Filtering criteria for posts. Every specified field is applied, or the action fails. When multiple filter fields are specified, they are combined using AND logic. Ignored entirely when customSearchUrl is specified.',
            properties: {
              sort: {
                type: 'string',
                enum: ['topMatch', 'latest'],
                description: 'Optional. How to order the results.',
              },
              datePosted: {
                type: 'string',
                enum: ['past24Hours', 'pastWeek', 'pastMonth'],
                description: 'Optional. How recently the post was published.',
              },
              contentType: {
                type: 'string',
                enum: ['videos', 'images', 'jobPosts', 'liveVideos', 'documents'],
                description: 'Optional. Kind of content the post must carry.',
              },
              postedBy: {
                type: 'array',
                description:
                  'Optional. Array of author relationships to you. Matches if the post was published by any of the listed ones.',
                items: {
                  type: 'string',
                  enum: ['me', 'firstConnections', 'peopleYouFollow'],
                },
              },
              fromMembers: {
                type: 'array',
                description:
                  'Optional. Array of people whose posts to keep. Each entry is a plain name string, or an object with name plus an optional urn or personHashedUrl that pins the exact person; both forms can be mixed in one array. With a name alone LinkedIn takes whichever suggestion it ranked first, which may be a namesake. An identifier no suggestion resolves to fails the action with filterNotApplied rather than filtering by a namesake.',
                items: PERSON_FILTER_ENTRY_JSON_SCHEMA,
              },
              fromCompanies: {
                type: 'array',
                description:
                  'Optional. Array of companies whose posts to keep. Same entry shape as fromMembers, with companyHashedUrl in place of personHashedUrl.',
                items: COMPANY_FILTER_ENTRY_JSON_SCHEMA,
              },
              mentioningMembers: {
                type: 'array',
                description:
                  'Optional. Array of people to look for in post text. Same entry shape as fromMembers.',
                items: PERSON_FILTER_ENTRY_JSON_SCHEMA,
              },
              mentioningCompanies: {
                type: 'array',
                description:
                  'Optional. Array of companies to look for in post text. Same entry shape as fromCompanies.',
                items: COMPANY_FILTER_ENTRY_JSON_SCHEMA,
              },
              authorCompanies: {
                type: 'array',
                description:
                  'Optional. Array of companies the author works at. Same entry shape as fromCompanies.',
                items: COMPANY_FILTER_ENTRY_JSON_SCHEMA,
              },
              authorIndustries: {
                type: 'array',
                description:
                  'Optional. Array of industry names the author works in. An industry is a taxonomy value rather than an entity, so it is matched by name only. Takes specific values available in the LinkedIn interface.',
                items: { type: 'string' },
              },
            },
          },
          customSearchUrl: {
            type: 'string',
            description:
              'Optional. URL copied from a LinkedIn content search page after configuring filters. When specified, filter is ignored entirely.',
          },
        },
        anyOf: [{ required: ['term'] }, { required: ['customSearchUrl'] }],
      } as Tool['inputSchema'],
    };
  }
}
