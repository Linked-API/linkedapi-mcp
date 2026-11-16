import { OPERATION_NAME, TRcRetrieveProjectCandidatesParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcRetrieveProjectCandidatesTool extends OperationTool<
  TRcRetrieveProjectCandidatesParams,
  unknown
> {
  public override readonly name = 'rc_retrieve_project_candidates' as const;
  public override readonly operationName = OPERATION_NAME.rcRetrieveProjectCandidates;
  protected override readonly schema = RC_SCHEMAS.rcRetrieveProjectCandidates;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Retrieve Project Candidates in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Use projectId from rc_retrieve_projects or rc_create_project. Omit stage to read all stages. Final result: an array of candidates with name, recruiterProfileUrl, headline, location, avatarUrl, viewerState.connectionDegree and stage.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
