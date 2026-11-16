import { OPERATION_NAME, TRcRenameProjectParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcRenameProjectTool extends OperationTool<TRcRenameProjectParams, unknown> {
  public override readonly name = 'rc_rename_project' as const;
  public override readonly operationName = OPERATION_NAME.rcRenameProject;
  protected override readonly schema = RC_SCHEMAS.rcRenameProject;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Rename Project in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Use projectId from rc_retrieve_projects or rc_create_project. Name is required; to change only the description, pass the current name. Omit description to leave it unchanged. Final result: no result data on success.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
