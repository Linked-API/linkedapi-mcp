import {
  OPERATION_NAME,
  TEndorsePersonSkillsParams,
  TPersonSkillEndorsement,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class EndorsePersonSkillsTool extends OperationTool<
  TEndorsePersonSkillsParams,
  Array<TPersonSkillEndorsement>
> {
  public override readonly name = 'endorse_person_skills';
  public override readonly operationName = OPERATION_NAME.endorsePersonSkills;
  protected override readonly schema = z.object({
    personUrl: z.string(),
    skillNamePatterns: z.array(z.string().min(1).max(200)).min(1).max(20).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        "Endorses selected skills of a 1st-degree connection, returning each selected skill's name, success and error if it failed. Skill names are in the profile owner's language. Patterns use RE2, are case-insensitive and match anywhere; anchor with ^…$ to match a whole name. Omit skillNamePatterns to endorse all skills; never pass []. An already-endorsed skill counts as success and is never removed. Each success counts toward the stEndorsements limit, including existing endorsements. The limit is checked for each skill; a failure does not stop the others, so check every item's success. If this workflow is still running, do not retry this tool; retrying can count the same skills toward the stEndorsements limit again.",
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description: 'Public or hashed LinkedIn URL of your 1st-degree connection.',
          },
          skillNamePatterns: {
            type: 'array',
            minItems: 1,
            maxItems: 20,
            items: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
            },
            description:
              "Optional. 1-20 RE2 patterns, each 1-200 characters, matching names in the profile owner's language. Any matching pattern selects the skill. Matching is case-insensitive and searches anywhere: manage matches Project Management; ^scrum$ matches only the whole name Scrum. Lookaround and backreferences are unsupported. Omit this parameter to endorse all skills; never pass an empty array.",
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
