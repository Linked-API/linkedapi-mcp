import { OPERATION_NAME } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class RetrieveInvitationsTool extends OperationTool<unknown, unknown> {
  public override readonly name = 'retrieve_invitations';
  public override readonly operationName = OPERATION_NAME.retrieveInvitations;
  protected override readonly schema = z.object({});

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Retrieves incoming connection, company-follow, and newsletter-subscription invitations received by your account (st.retrieveInvitations action).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
