import LinkedApi, {
  SIGNAL_TYPE,
  TCreateSignalParams,
  TMappedResponse,
  TSignal,
  TSignalPostSearchFilter,
  TSignalType,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

interface TCreateSignalArgs {
  type: TSignalType;
  label?: string;
  personUrl?: string;
  companyUrl?: string;
  postUrl?: string;
  myPosts?: true;
  term?: Array<string>;
  filter?: TSignalPostSearchFilter;
  listId?: string;
}

type TTargetField = Exclude<keyof TCreateSignalArgs, 'type' | 'label'>;

const TARGET_FIELDS: ReadonlyArray<TTargetField> = [
  'personUrl',
  'companyUrl',
  'postUrl',
  'myPosts',
  'term',
  'filter',
  'listId',
];

const TARGET_FIELDS_BY_TYPE = {
  [SIGNAL_TYPE.personPosts]: ['personUrl'],
  [SIGNAL_TYPE.companyPosts]: ['companyUrl'],
  [SIGNAL_TYPE.postSearch]: ['term', 'filter'],
  [SIGNAL_TYPE.postEngagement]: ['postUrl', 'myPosts'],
  [SIGNAL_TYPE.network]: [],
  [SIGNAL_TYPE.profileViewers]: [],
  [SIGNAL_TYPE.listAlerts]: ['listId'],
} as const satisfies Record<TSignalType, ReadonlyArray<TTargetField>>;

const ACTOR_FILTER_ENTRY_SCHEMA = z.union([
  z.string().min(1),
  z.object({
    name: z.string().min(1),
    id: z.string().min(1).optional(),
  }),
]);

const ACTOR_FILTER_ENTRY_JSON_SCHEMA = {
  anyOf: [
    {
      type: 'string',
      minLength: 1,
      description: 'Name of the person or company, shorthand for { name }.',
    },
    {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          description: 'Required. Name of the person or company.',
        },
        id: {
          type: 'string',
          minLength: 1,
          description:
            'Optional. URN or LinkedIn URL that pins the filter to exactly that person or company.',
        },
      },
      required: ['name'],
    },
  ],
};

export class CreateSignalTool extends LinkedApiTool<TCreateSignalArgs, TSignal> {
  public readonly name = 'create_signal';
  // One flat object rather than a union per type: ChatGPT wraps the arguments of a tool whose schema
  // has a root anyOf/oneOf in { value }. Which fields go with which type is checked here instead.
  protected readonly schema = z
    .object({
      type: z.enum(Object.values(SIGNAL_TYPE)),
      label: z.string().min(1).max(64).optional(),
      personUrl: z.string().min(1).optional(),
      companyUrl: z.string().min(1).optional(),
      postUrl: z.string().min(1).optional(),
      myPosts: z.literal(true).optional(),
      term: z.array(z.string().min(1).max(50)).min(1).max(3).optional(),
      filter: z
        .object({
          contentType: z
            .enum(['videos', 'images', 'jobPosts', 'liveVideos', 'documents'])
            .optional(),
          postedBy: z
            .array(z.enum(['me', 'firstConnections', 'peopleYouFollow']))
            .min(1)
            .optional(),
          mentioningMembers: z.array(ACTOR_FILTER_ENTRY_SCHEMA).min(1).optional(),
          mentioningCompanies: z.array(ACTOR_FILTER_ENTRY_SCHEMA).min(1).optional(),
          authorCompanies: z.array(ACTOR_FILTER_ENTRY_SCHEMA).min(1).optional(),
          authorIndustries: z.array(z.string().min(1)).min(1).optional(),
        })
        .optional(),
      listId: z
        .string()
        .regex(/^[1-9]\d*$/)
        .optional(),
    })
    .superRefine((args, context) => {
      const allowedFields: ReadonlyArray<TTargetField> = TARGET_FIELDS_BY_TYPE[args.type];
      for (const field of TARGET_FIELDS) {
        if (args[field] !== undefined && !allowedFields.includes(field)) {
          context.addIssue({
            code: 'custom',
            path: [field],
            message: `Unexpected ${field} for ${args.type}`,
          });
        }
      }

      const missingTarget = findMissingTarget(args);
      if (missingTarget) {
        context.addIssue({
          code: 'custom',
          message: missingTarget,
        });
      }
    });

  public override async execute({
    linkedapi,
    args,
  }: {
    linkedapi: LinkedApi;
    args: TCreateSignalArgs;
  }): Promise<TMappedResponse<TSignal>> {
    return linkedapi.createSignal(args as TCreateSignalParams);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Create a signal: the account checks one thing on LinkedIn on a schedule and records every new item it finds as an event, which you read with get_signal_events. The first check records a silent baseline: what is already there is not reported, except that personPosts, companyPosts and postSearch signals report posts published since the signal was created, and listAlerts signals report alerts published since then. Creating a signal that already exists on the account (same type and target) returns that signal instead of a second one; a paused one stays paused. Pass only the target fields of the chosen type:\n' +
        '- network: no target. Reports connectionAccepted, connectionAdded and connectionRequestReceived. Checked every hour; spends nothing from account limits.\n' +
        '- profileViewers: no target. Reports profileViewed. Checked every 3 hours; spends nothing from account limits.\n' +
        '- personPosts: personUrl. companyPosts: companyUrl. Reports postPublished. Checked once or twice a day. The first check opens the profile or company page once (1 of stPersonProfileViews or stCompanyPageViews, and the person may see the account among their profile viewers); later checks mostly run as LinkedIn searches and spend some stSearchQueries – usually a few a day for the whole account – plus occasional visits.\n' +
        '- postSearch: term (1 to 3 phrases) and an optional filter. Reports postFound for new posts matching any phrase. Checked once or twice a day; each check spends 1 of stSearchQueries. By default an account has 300 searches a month and each postSearch signal spends 30 to 60 of them, so put the wordings of one topic into one signal rather than a signal per phrase.\n' +
        '- postEngagement: postUrl, or myPosts: true for the posts the account publishes. Reports commentAdded and reactionAdded. Spends nothing from account limits, apart from occasional visits. A postUrl signal watches the post for 30 days, then stops.\n' +
        "- listAlerts: listId, one of the account's own Sales Navigator lists as nv_retrieve_lists returns it. Reports alertPublished: the alerts Sales Navigator raises about the list's members, such as their posts, job changes and company updates. Each event carries the alert exactly as nv_retrieve_alerts returns it, plus subjectUrn and subjectHashedUrl in the form nv_retrieve_list_leads and nv_retrieve_list_accounts return as urn and hashedUrl. LinkedIn chooses which activity raises an alert and publishes it hours after the activity. Watch a list the account built itself: lists Sales Navigator fills on its own with people the account has not saved get only occasional suggested alerts. Needs an active Sales Navigator subscription; very large lists are not supported yet. Spends nothing from account limits.\n" +
        'Fails with signalLimitReached when the account already has the maximum number of active signals of this type: pause or delete one first.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: Object.values(SIGNAL_TYPE),
            description:
              'What to watch: network, profileViewers, personPosts, companyPosts, postSearch, postEngagement or listAlerts.',
          },
          label: {
            type: 'string',
            minLength: 1,
            maxLength: 64,
            description:
              'Optional. Your own identifier, up to 64 characters, such as a CRM record ID. It comes back with the signal and with every event it produces.',
          },
          personUrl: {
            type: 'string',
            description:
              "personPosts only, required there. LinkedIn profile URL of the person (e.g., 'https://www.linkedin.com/in/john-doe').",
          },
          companyUrl: {
            type: 'string',
            description:
              "companyPosts only, required there. LinkedIn company page URL (e.g., 'https://www.linkedin.com/company/example').",
          },
          postUrl: {
            type: 'string',
            description:
              'postEngagement only. URL of the post whose new comments and reactions to report. Pass postUrl or myPosts, not both.',
          },
          myPosts: {
            type: 'boolean',
            enum: [true],
            description:
              "postEngagement only. true to watch comments and reactions on the account's own posts. Pass postUrl or myPosts, not both.",
          },
          term: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: {
              type: 'string',
              minLength: 1,
              maxLength: 50,
            },
            description:
              'postSearch only, required there. 1 to 3 phrases, each up to 50 characters and with no quotation marks inside; a single phrase is a one-item array. Each phrase is searched as an exact phrase, and a post containing any of them is reported.',
          },
          filter: {
            type: 'object',
            description:
              'postSearch only, optional. Narrows the search; a post must match every field you set. The signal always looks for the newest posts, so there is no sort or date filter.',
            properties: {
              contentType: {
                type: 'string',
                enum: ['videos', 'images', 'jobPosts', 'liveVideos', 'documents'],
                description: 'Kind of content the post must carry.',
              },
              postedBy: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['me', 'firstConnections', 'peopleYouFollow'],
                },
                description: 'Author relationships to the account; matches any of them.',
              },
              mentioningMembers: {
                type: 'array',
                items: ACTOR_FILTER_ENTRY_JSON_SCHEMA,
                description:
                  'People the post mentions; matches any of them. A name alone may match a namesake; an id pins the exact person.',
              },
              mentioningCompanies: {
                type: 'array',
                items: ACTOR_FILTER_ENTRY_JSON_SCHEMA,
                description: 'Companies the post mentions; matches any of them.',
              },
              authorCompanies: {
                type: 'array',
                items: ACTOR_FILTER_ENTRY_JSON_SCHEMA,
                description: 'Companies the author works at; matches any of them.',
              },
              authorIndustries: {
                type: 'array',
                items: { type: 'string' },
                description:
                  'Industries the author works in, by the names LinkedIn shows; matches any of them.',
              },
            },
          },
          listId: {
            type: 'string',
            pattern: '^[1-9]\\d*$',
            description:
              "listAlerts only, required there. The id of one of the account's own Sales Navigator lists, as nv_retrieve_lists returns it: a string of digits.",
          },
        },
        required: ['type'],
      } as Tool['inputSchema'],
    };
  }
}

function findMissingTarget({
  type,
  personUrl,
  companyUrl,
  postUrl,
  myPosts,
  term,
  listId,
}: TCreateSignalArgs): string | undefined {
  switch (type) {
    case SIGNAL_TYPE.personPosts:
      return personUrl ? undefined : 'personPosts needs personUrl.';
    case SIGNAL_TYPE.companyPosts:
      return companyUrl ? undefined : 'companyPosts needs companyUrl.';
    case SIGNAL_TYPE.postSearch:
      return term ? undefined : 'postSearch needs term.';
    case SIGNAL_TYPE.postEngagement:
      return Boolean(postUrl) !== Boolean(myPosts)
        ? undefined
        : 'postEngagement needs either postUrl or myPosts: true.';
    case SIGNAL_TYPE.listAlerts:
      return listId ? undefined : 'listAlerts needs listId.';
    default:
      return undefined;
  }
}
