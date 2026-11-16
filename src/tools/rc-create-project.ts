import { OPERATION_NAME, TRcCreateProjectParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcCreateProjectTool extends OperationTool<TRcCreateProjectParams, unknown> {
  public override readonly name = 'rc_create_project' as const;
  public override readonly operationName = OPERATION_NAME.rcCreateProject;
  protected override readonly schema = RC_SCHEMAS.rcCreateProject;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Create Project in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Creation is not idempotent: after a failure, check your projects before creating again (a duplicate can only be archived). Final result: { projectId, projectUrl, name }; name may be null if it could not be read back, but the project exists.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
