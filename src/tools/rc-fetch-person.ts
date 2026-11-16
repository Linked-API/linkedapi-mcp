import { OPERATION_NAME, TRcOpenPersonPageParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcFetchPersonTool extends OperationTool<TRcOpenPersonPageParams, unknown> {
  public override readonly name = 'rc_fetch_person' as const;
  public override readonly operationName = OPERATION_NAME.rcFetchPerson;
  protected override readonly schema = RC_SCHEMAS.rcFetchPerson;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Fetch Person in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Use personUrl from recruiterProfileUrl in rc_search_people or rc_retrieve_project_candidates, or personRecruiterUrl in get_inbox. basicInfo defaults to true; recruitingActivity defaults to false. Final result: candidate profile fields including recruiterProfileUrl, publicUrl and industry, with optional recruitingActivity counts for projects, messages, feedback and attachments.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
