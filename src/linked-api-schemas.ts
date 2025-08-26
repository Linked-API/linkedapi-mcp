import { OPERATION_NAME } from 'linkedapi-node';
import { z } from 'zod';

export const retrieveConnectionsSchema = z.object({
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
export type RetrieveConnectionsInput = z.infer<typeof retrieveConnectionsSchema>;

export const removeConnectionSchema = z.object({
  personUrl: z.string(),
});

export const sendMessageSchema = z.object({
  personUrl: z.string(),
  text: z.string().min(1),
});

export const syncConversationSchema = z.object({
  personUrl: z.string(),
});

export const nvSendMessageSchema = z.object({
  personUrl: z.string(),
  text: z.string().min(1),
  subject: z.string().optional(),
});

export const nvSyncConversationSchema = z.object({
  personUrl: z.string(),
});

export const pollConversationsSchema = z.object({
  conversations: z.array(
    z.object({
      personUrl: z.string(),
      type: z.enum(['st', 'nv']).default('st'),
      since: z.string().optional(),
    }),
  ),
});

export const fetchPersonSchema = z.object({
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

export const nvFetchPersonSchema = z.object({
  personHashedUrl: z.string(),
});

export const fetchCompanySchema = z.object({
  companyUrl: z.string(),
  retrieveEmployees: z.boolean().optional().default(false),
  retrieveDMs: z.boolean().optional().default(false),
  retrievePosts: z.boolean().optional().default(false),
  employeesRetrievalConfig: z
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
  dmsRetrievalConfig: z
    .object({
      limit: z.number().min(1).max(20).optional(),
    })
    .optional(),
  postsRetrievalConfig: z
    .object({
      limit: z.number().min(1).max(20).optional(),
      since: z.string().optional(),
    })
    .optional(),
});

export const nvFetchCompanySchema = z.object({
  companyHashedUrl: z.string(),
  retrieveEmployees: z.boolean().optional().default(false),
  retrieveDMs: z.boolean().optional().default(false),
  employeesRetrievalConfig: z
    .object({
      limit: z.number().min(1).max(500).optional(),
      filter: z
        .object({
          positions: z.array(z.string()).optional(),
          yearsOfExperiences: z.array(z.string()).optional(),
          industries: z.array(z.string()).optional(),
          schools: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
  dmsRetrievalConfig: z
    .object({
      limit: z.number().min(1).max(20).optional(),
    })
    .optional(),
});

export const fetchPostSchema = z.object({
  postUrl: z.string(),
});

export const searchCompaniesSchema = z.object({
  term: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  filter: z
    .object({
      locations: z.array(z.string()).optional(),
      industries: z.array(z.string()).optional(),
      sizes: z
        .array(
          z.enum([
            '1-10',
            '11-50',
            '51-200',
            '201-500',
            '501-1000',
            '1001-5000',
            '5001-10000',
            '10001+',
          ]),
        )
        .optional(),
    })
    .optional(),
});

export const nvSearchCompaniesSchema = z.object({
  term: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  filter: z
    .object({
      locations: z.array(z.string()).optional(),
      industries: z.array(z.string()).optional(),
      sizes: z
        .array(
          z.enum([
            '1-10',
            '11-50',
            '51-200',
            '201-500',
            '501-1000',
            '1001-5000',
            '5001-10000',
            '10001+',
          ]),
        )
        .optional(),
      annualRevenue: z
        .object({
          min: z.string().optional(),
          max: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const searchPeopleSchema = z.object({
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
    })
    .optional(),
});

export const nvSearchPeopleSchema = z.object({
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
      yearsOfExperience: z.array(z.string()).optional(),
    })
    .optional(),
});

export const sendConnectionRequestSchema = z.object({
  personUrl: z.string(),
  note: z.string().optional(),
});

export const checkConnectionStatusSchema = z.object({
  personUrl: z.string(),
});

export const withdrawConnectionRequestSchema = z.object({
  personUrl: z.string(),
});

export const retrievePendingRequestsSchema = z.object({});

export const reactToPostSchema = z.object({
  postUrl: z.string(),
  type: z.enum(['like', 'love', 'celebrate', 'support', 'funny', 'insightful']).or(z.string()),
});

export const commentOnPostSchema = z.object({
  postUrl: z.string(),
  text: z.string().min(1),
});

export const retrieveSSISchema = z.object({});
export const retrievePerformanceSchema = z.object({});

export const getApiUsageStatsSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const executeCustomWorkflowSchema = z.object({
  definition: z.any(),
});

export const getWorkflowResultSchema = z.object({
  workflowId: z.string(),
  operationName: z.enum(Object.values(OPERATION_NAME)),
});

export const restoreWorkflowSchema = z.object({
  workflowId: z.string(),
  operationName: z.string().describe('Always use this for type safety if possible'),
});
