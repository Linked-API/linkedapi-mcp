import { OPERATION_NAME, TEndorsePersonSkillParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class EndorsePersonSkillTool extends OperationTool<TEndorsePersonSkillParams, void> {
  public override readonly name = 'endorse_person_skill';
  public override readonly operationName = OPERATION_NAME.endorsePersonSkill;
  protected override readonly schema = z.object({
    personUrl: z.string(),
    skillName: z.string().min(1).max(200),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        "Endorses one skill by name on a 1st-degree connection's profile. Skill names are in the profile owner's language, regardless of your LinkedIn language. An already-endorsed skill counts as success and is never removed. Every success, including an existing endorsement, counts toward the stEndorsements limit. Use endorse_person_skills to select skills with patterns or endorse all skills. If this workflow is still running, do not retry this tool; retrying can count the same skill toward the stEndorsements limit again.",
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description: 'Public or hashed LinkedIn URL of your 1st-degree connection.',
          },
          skillName: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            description:
              "Exact skill name in the profile owner's language, up to 200 characters. Letter case and extra spaces are ignored. This is not a pattern.",
          },
        },
        required: ['personUrl', 'skillName'],
      },
    };
  }
}
