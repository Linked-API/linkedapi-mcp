import { OPERATION_NAME, TRcSearchPeopleParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcSearchPeopleTool extends OperationTool<TRcSearchPeopleParams, unknown> {
  public override readonly name = 'rc_search_people' as const;
  public override readonly operationName = OPERATION_NAME.rcSearchPeople;
  protected override readonly schema = RC_SCHEMAS.rcSearchPeople;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Search People in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Provide term, a nonempty filter, or customSearchUrl; a custom URL cannot be combined with term or filter. Filters alone are accepted; scope fields and false booleans alone are not search criteria. Final result: an array of candidates with name, recruiterProfileUrl, headline, location, avatarUrl and viewerState.connectionDegree.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
