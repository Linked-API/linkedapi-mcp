import { OPERATION_NAME, TRcSendMessageParams } from '@linkedapi/node';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';
import { RC_SCHEMAS } from '../utils/rc-schemas.js';

export class RcSendMessageTool extends OperationTool<TRcSendMessageParams, unknown> {
  public override readonly name = 'rc_send_message' as const;
  public override readonly operationName = OPERATION_NAME.rcSendMessage;
  protected override readonly schema = RC_SCHEMAS.rcSendMessage;
  public override getTool(): Tool {
    const inputSchema = z.toJSONSchema(this.schema);
    delete inputSchema.$schema;
    return {
      name: this.name,
      description:
        "Send Message in Recruiter Lite. Requires a LinkedIn Recruiter Lite seat and Linked API's Plus plan. Use personUrl from recruiterProfileUrl in rc_search_people or rc_retrieve_project_candidates, or personRecruiterUrl in get_inbox. New InMail requires personUrl, subject (1–200 characters, one line) and text (1–1900 characters). Reply with threadId from get_inbox and text only, without personUrl or subject. A paid InMail credit is spent only when allowPaidCredit is true. Turn on allowPaidCredit only when the user has explicitly approved spending a paid InMail credit on this message; on inMailCreditRequired, ask the user instead of retrying with allowPaidCredit on. After an unexpectedError, check the conversation before sending again. Final result: { creditUsed }.",
      inputSchema: inputSchema as Tool['inputSchema'],
    };
  }
}
