import { OPERATION_NAME, TRcRetrieveProjectsParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcRetrieveProjectsTool extends OperationTool<TRcRetrieveProjectsParams, unknown> {
  public override readonly name = 'rc_retrieve_projects' as const;
  public override readonly operationName = OPERATION_NAME.rcRetrieveProjects;
  protected override readonly schema = RC_SCHEMAS.rcRetrieveProjects;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Retrieve Projects in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Final result: an array of active projects with projectId, name, createdAt, candidateCount and projectUrl. Pass projectId to the project tools.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
