import { RC_FILTER_OPTIONS } from '@linkedapi/node';
import { z } from 'zod';

const PERSON_URL_SCHEMA = z
  .string()
  .regex(/^https:\/\/www\.linkedin\.com\/talent\/profile\/[^/?#]+/)
  .describe(
    'Recruiter profile URL (https://www.linkedin.com/talent/profile/…) from recruiterProfileUrl in rc_search_people or rc_retrieve_project_candidates, or personRecruiterUrl in get_inbox; public /in/ URLs are not accepted',
  );
const PROJECT_ID_SCHEMA = z
  .string()
  .regex(/^\d+$/)
  .describe('Project ID as a string of digits from rc_retrieve_projects or rc_create_project');
const LIMIT_SCHEMA = z
  .number()
  .int()
  .min(1)
  .max(1000)
  .optional()
  .describe('Maximum results, 1–1000, default 25');
const PROJECT_NAME_SCHEMA = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[^\r\n]+$/)
  .describe('Project name, 1–100 characters, one line');
function range(minimum: number, maximum: number): z.ZodType {
  return z
    .object({
      from: z.number().int().min(minimum).max(maximum).optional(),
      to: z.number().int().min(minimum).max(maximum).optional(),
    })
    .refine(
      ({ from, to }): boolean =>
        (from !== undefined || to !== undefined) &&
        (from === undefined || to === undefined || from <= to),
      'Provide at least one bound, with from <= to',
    );
}
const FILTER_SCHEMA = z.object({
  jobTitles: z.array(z.string().regex(/\S/)).optional(),
  jobTitlesScope: z.enum(['currentOrPast', 'current', 'pastNotCurrent', 'past']).optional(),
  locations: z.array(z.string().regex(/\S/)).optional(),
  locationsScope: z.enum(['current', 'currentOrOpenToRelocate', 'openToRelocateOnly']).optional(),
  postalCode: z
    .object({
      code: z.string().regex(/\S/),
      radiusMiles: z
        .union([
          z.literal(1),
          z.literal(5),
          z.literal(10),
          z.literal(25),
          z.literal(50),
          z.literal(100),
          z.literal(200),
        ])
        .optional(),
    })
    .optional(),
  skills: z.array(z.string().regex(/\S/)).optional(),
  hasPassedSkillAssessment: z
    .boolean()
    .describe('Set checkbox on or off; false is not an inverse filter')
    .optional(),
  companies: z.array(z.string().regex(/\S/)).optional(),
  companiesScope: z.enum(['currentOrPast', 'current', 'pastNotCurrent', 'past']).optional(),
  currentCompanies: z.array(z.string().regex(/\S/)).optional(),
  pastCompanies: z.array(z.string().regex(/\S/)).optional(),
  companySizes: z.array(z.enum(RC_FILTER_OPTIONS.companySizes)).optional(),
  schools: z.array(z.string().regex(/\S/)).optional(),
  graduationYears: range(1900, 2100).optional(),
  industries: z.array(z.string().regex(/\S/)).optional(),
  jobFunctions: z.array(z.enum(RC_FILTER_OPTIONS.jobFunctions)).optional(),
  seniority: z.array(z.enum(RC_FILTER_OPTIONS.seniority)).optional(),
  yearsOfExperience: range(0, 30).optional(),
  firstNames: z.array(z.string().regex(/\S/)).optional(),
  lastNames: z.array(z.string().regex(/\S/)).optional(),
  profileLanguages: z
    .array(z.string().regex(/^[a-z_]{2,3}$/))
    .describe('LinkedIn language codes such as en, es, in (Indonesian), _o (Other), not names')
    .optional(),
  recentlyJoined: z.array(z.enum(RC_FILTER_OPTIONS.recentlyJoined)).optional(),
  networkRelationships: z.array(z.enum(RC_FILTER_OPTIONS.networkRelationships)).optional(),
  isMilitaryVeteran: z
    .boolean()
    .describe('Set checkbox on or off; false is not an inverse filter')
    .optional(),
  groups: z.array(z.string().regex(/\S/)).optional(),
  recruitingActivity: z
    .object({
      type: z.enum(RC_FILTER_OPTIONS.recruitingActivityType),
      period: z.enum(RC_FILTER_OPTIONS.recruitingActivityPeriod).optional(),
    })
    .optional(),
  projects: z.array(z.string().regex(/\S/)).describe('Project names, not IDs').optional(),
  notes: z.array(z.string().regex(/\S/)).optional(),
  hidePreviouslyViewed: z
    .boolean()
    .describe('Set checkbox on or off; false is not an inverse filter')
    .optional(),
});
export const RC_SCHEMAS = {
  rcSearchPeople: z
    .object({
      term: z.string().regex(/\S/).optional(),
      filter: FILTER_SCHEMA.optional(),
      customSearchUrl: z.string().url().optional(),
      limit: LIMIT_SCHEMA,
    })
    .superRefine((value, context): void => {
      if (value.customSearchUrl !== undefined) {
        if (value.term !== undefined || value.filter !== undefined)
          context.addIssue({
            code: 'custom',
            message: 'customSearchUrl cannot be combined with term or filter',
          });
      } else if (
        !value.term &&
        !Object.entries(value.filter ?? {}).some(
          ([key, item]): boolean => !key.endsWith('Scope') && hasValue(item),
        )
      )
        context.addIssue({
          code: 'custom',
          message: 'Provide term, a nonempty filter, or customSearchUrl',
        });
    }),
  rcFetchPerson: z.object({
    personUrl: PERSON_URL_SCHEMA,
    basicInfo: z.boolean().optional().describe('Read candidate details; SDK default true'),
    recruitingActivity: z.boolean().optional().describe('Read recruiting activity; default false'),
  }),
  rcRetrieveProjects: z.object({ limit: LIMIT_SCHEMA }),
  rcRetrieveProjectCandidates: z.object({
    projectId: PROJECT_ID_SCHEMA,
    stage: z.enum(['uncontacted', 'contacted', 'replied', 'archived']).optional(),
    limit: LIMIT_SCHEMA,
  }),
  rcSaveToProject: z.object({
    personUrl: PERSON_URL_SCHEMA.describe(
      'Recruiter profile URL (/talent/profile/…) of the candidate to save to this project',
    ),
    projectId: PROJECT_ID_SCHEMA,
  }),
  rcCreateProject: z.object({ name: PROJECT_NAME_SCHEMA }),
  rcRenameProject: z.object({
    projectId: PROJECT_ID_SCHEMA,
    name: PROJECT_NAME_SCHEMA,
    description: z
      .string()
      .max(2000)
      .optional()
      .describe('Omit to leave unchanged; up to 2000 characters'),
  }),
  rcArchiveProject: z.object({ projectId: PROJECT_ID_SCHEMA }),
  rcSendMessage: z
    .object({
      personUrl: PERSON_URL_SCHEMA.optional(),
      subject: z
        .string()
        .min(1)
        .max(200)
        .regex(/^[^\r\n]+$/)
        .optional(),
      threadId: z
        .string()
        .min(1)
        .max(58)
        .regex(/^[A-Za-z0-9_+=/-]+$/)
        .optional(),
      text: z.string().min(1).max(1900),
      allowPaidCredit: z
        .boolean()
        .optional()
        .describe(
          'A paid InMail credit is spent only when this is true; default false. Turn on allowPaidCredit only when the user has explicitly approved spending a paid InMail credit on this message; on inMailCreditRequired, ask the user instead of retrying with allowPaidCredit on.',
        ),
    })
    .superRefine((value, context): void => {
      const isReply = value.threadId !== undefined;
      if (
        isReply
          ? value.personUrl !== undefined || value.subject !== undefined
          : !value.personUrl || !value.subject
      )
        context.addIssue({
          code: 'custom',
          message:
            'Provide personUrl, subject and text, or threadId and text without personUrl or subject',
        });
    }),
  rcSyncInbox: z.object({}),
} as const;
function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.values(value).some(hasValue);
  return (
    value === true ||
    typeof value === 'number' ||
    (typeof value === 'string' && value.trim().length > 0)
  );
}
