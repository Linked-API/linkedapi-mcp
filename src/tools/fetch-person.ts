import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OPERATION_NAME, TFetchPersonParams } from '@linkedapi/node';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class FetchPersonTool extends OperationTool<TFetchPersonParams, unknown> {
  public override readonly name = 'fetch_person';
  public override readonly operationName = OPERATION_NAME.fetchPerson;
  protected override readonly schema = z.object({
    personUrl: z.string(),
    retrieveExperience: z.boolean().optional().default(false),
    retrieveEducation: z.boolean().optional().default(false),
    retrieveSkills: z.boolean().optional().default(false),
    retrieveLanguages: z.boolean().optional().default(false),
    retrievePosts: z.boolean().optional().default(false),
    retrieveComments: z.boolean().optional().default(false),
    retrieveReactions: z.boolean().optional().default(false),
    postsRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(20).optional(),
        since: z.string().optional(),
      })
      .optional(),
    commentsRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(20).optional(),
        since: z.string().optional(),
      })
      .optional(),
    reactionsRetrievalConfig: z
      .object({
        limit: z.number().min(1).max(20).optional(),
        since: z.string().optional(),
      })
      .optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description: `Allows you to open a person page to retrieve their basic information and perform additional person-related actions if needed. (st.openPersonPage action). Allows additional optional retrieval of experience, education, skills, languages, posts, comments and reactions.
⚠️ **PERFORMANCE WARNING**: Only set additional retrieval flags to true if you specifically need that data. Each additional parameter significantly increases execution time:
💡 **Recommendation**: Start with basic info only. Only request additional data if the user explicitly asks for it or if it's essential for the current task.
`,
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "The LinkedIn profile URL of the person to fetch (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
          retrieveExperience: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the person's experience information. Default is false.",
          },
          retrieveEducation: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the person's education information. Default is false.",
          },
          retrieveSkills: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the person's skills information. Default is false.",
          },
          retrieveLanguages: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the person's languages information. Default is false.",
          },
          retrievePosts: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the person's posts information. Default is false.",
          },
          retrieveComments: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the person's comments information. Default is false.",
          },
          retrieveReactions: {
            type: 'boolean',
            description:
              "Optional. Whether to retrieve the person's reactions information. Default is false.",
          },
          postsRetrievalConfig: {
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
          commentsRetrievalConfig: {
            type: 'object',
            description:
              'Optional. Configuration for retrieving comments. Available only if retrieveComments is true.',
            properties: {
              limit: {
                type: 'number',
                description:
                  'Optional. Number of comments to retrieve. Defaults to 20, with a maximum value of 20.',
              },
              since: {
                type: 'string',
                description:
                  'Optional. ISO 8601 timestamp to filter comments made after the specified time.',
              },
            },
          },
          reactionsRetrievalConfig: {
            type: 'object',
            description:
              'Optional. Configuration for retrieving reactions. Available only if retrieveReactions is true.',
            properties: {
              limit: {
                type: 'number',
                description:
                  'Optional. Number of reactions to retrieve. Defaults to 20, with a maximum value of 20.',
              },
              since: {
                type: 'string',
                description:
                  'Optional. ISO 8601 timestamp to filter reactions made after the specified time.',
              },
            },
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
