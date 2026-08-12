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
        'Retrieves incoming connection, company-follow, and newsletter-subscription invitations received by your account (st.retrieveInvitations action). Every invitation carries urn — the permanent LinkedIn member URN (urn:li:member:<id>) of the person who sent it, or null when LinkedIn does not expose it.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}
