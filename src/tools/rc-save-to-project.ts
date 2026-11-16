import { OPERATION_NAME, TRcSaveToProjectParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcSaveToProjectTool extends OperationTool<TRcSaveToProjectParams, unknown> {
  public override readonly name = 'rc_save_to_project' as const;
  public override readonly operationName = OPERATION_NAME.rcSaveToProject;
  protected override readonly schema = RC_SCHEMAS.rcSaveToProject;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Save to Project in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Use personUrl from recruiterProfileUrl in rc_search_people or rc_retrieve_project_candidates, or personRecruiterUrl in get_inbox. Use projectId from rc_retrieve_projects or rc_create_project. Safe to repeat. Final result: { alreadyInProject }, true when the candidate was already saved and nothing changed.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
