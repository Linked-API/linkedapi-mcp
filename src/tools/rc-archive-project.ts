import { OPERATION_NAME, TRcArchiveProjectParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcArchiveProjectTool extends OperationTool<TRcArchiveProjectParams, unknown> {
  public override readonly name = 'rc_archive_project' as const;
  public override readonly operationName = OPERATION_NAME.rcArchiveProject;
  protected override readonly schema = RC_SCHEMAS.rcArchiveProject;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Archive Project in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Use projectId from rc_retrieve_projects or rc_create_project. Safe to repeat. Final result: { alreadyArchived }, true when the project was already archived and nothing changed.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
