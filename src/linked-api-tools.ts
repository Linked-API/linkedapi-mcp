import LinkedApi from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { AcceptInvitationTool } from './tools/accept-invitation.js';
import { AdminCancelConnectionSessionTool } from './tools/admin-cancel-connection-session.js';
import { AdminConnectAccountTool } from './tools/admin-connect-account.js';
import { AdminCreateReconnectionSessionTool } from './tools/admin-create-reconnection-session.js';
import { AdminDeleteLimitsTool } from './tools/admin-delete-limits.js';
import { AdminDisconnectAccountTool } from './tools/admin-disconnect-account.js';
import { AdminGetAccountsTool } from './tools/admin-get-accounts.js';
import { AdminGetConnectionSessionTool } from './tools/admin-get-connection-session.js';
import { AdminGetLimitsDefaultsTool } from './tools/admin-get-limits-defaults.js';
import { AdminGetLimitsUsageTool } from './tools/admin-get-limits-usage.js';
import { AdminGetLimitsTool } from './tools/admin-get-limits.js';
import { AdminGetSeatsTool } from './tools/admin-get-seats.js';
import { AdminGetSubscriptionStatusTool } from './tools/admin-get-subscription-status.js';
import { AdminRegenerateTokenTool } from './tools/admin-regenerate-token.js';
import { AdminReparseAccountInfoTool } from './tools/admin-reparse-account-info.js';
import { AdminResetLimitsTool } from './tools/admin-reset-limits.js';
import { AdminSetLimitsTool } from './tools/admin-set-limits.js';
import { AdminSetSeatsTool } from './tools/admin-set-seats.js';
import { CheckConnectionStatusTool } from './tools/check-connection-status.js';
import { CommentOnPostTool } from './tools/comment-on-post.js';
import { CreatePostTool } from './tools/create-post.js';
import { ExecuteCustomWorkflowTool } from './tools/execute-custom-workflow.js';
import { FetchCompanyTool } from './tools/fetch-company.js';
import { FetchJobTool } from './tools/fetch-job.js';
import { FetchPersonTool } from './tools/fetch-person.js';
import { FetchPostTool } from './tools/fetch-post.js';
import { GetApiUsageTool } from './tools/get-api-usage-stats.js';
import { GetConversationTool } from './tools/get-conversation.js';
import { GetInboxTool } from './tools/get-inbox.js';
import { GetNetworkTool } from './tools/get-network.js';
import { GetWorkflowResultTool } from './tools/get-workflow-result.js';
import { IgnoreInvitationTool } from './tools/ignore-invitation.js';
import { ManageConversationTool } from './tools/manage-conversation.js';
import { NvFetchCompanyTool } from './tools/nv-fetch-company.js';
import { NvFetchPersonTool } from './tools/nv-fetch-person.js';
import { NvGetConversationTool } from './tools/nv-get-conversation.js';
import { NvManageConversationTool } from './tools/nv-manage-conversation.js';
import { NvSearchCompaniesTool } from './tools/nv-search-companies.js';
import { NvSearchPeopleTool } from './tools/nv-search-people.js';
import { NvSendMessageTool } from './tools/nv-send-message.js';
import { NvSyncInboxTool } from './tools/nv-sync-inbox.js';
import { ReactToPostTool } from './tools/react-to-post.js';
import { RemoveConnectionTool } from './tools/remove-connection.js';
import { RetrieveConnectionsTool } from './tools/retrieve-connections.js';
import { RetrieveFeedTool } from './tools/retrieve-feed.js';
import { RetrieveInvitationsTool } from './tools/retrieve-invitations.js';
import { RetrievePendingRequestsTool } from './tools/retrieve-pending-requests.js';
import { RetrievePerformanceTool } from './tools/retrieve-performance.js';
import { RetrieveSSITool } from './tools/retrieve-ssi.js';
import { SearchCompaniesTool } from './tools/search-companies.js';
import { SearchJobsTool } from './tools/search-jobs.js';
import { SearchPeopleTool } from './tools/search-people.js';
import { SendConnectionRequestTool } from './tools/send-connection-request.js';
import { SendMessageTool } from './tools/send-message.js';
import { SyncInboxTool } from './tools/sync-inbox.js';
import { SyncNetworkTool } from './tools/sync-network.js';
import { WithdrawConnectionRequestTool } from './tools/withdraw-connection-request.js';
import type { TLinkedApiToolResult } from './types/linked-api-tool-result.type.js';
import { AdminTool } from './utils/admin-tool.js';

interface TRegisteredLinkedApiTool {
  readonly name: string;
  getTool(): Tool;
  validate(args: unknown): unknown;
  execute(options: {
    linkedapi: LinkedApi;
    args: never;
    mcpClient: string;
  }): Promise<TLinkedApiToolResult<unknown>>;
}

export class LinkedApiTools {
  public readonly tools: ReadonlyArray<TRegisteredLinkedApiTool>;
  public readonly adminTools: ReadonlyArray<AdminTool<unknown, unknown>>;

  constructor() {
    this.tools = [
      // Standard tools
      new SendMessageTool(),
      new GetConversationTool(),
      new SyncInboxTool(),
      new GetInboxTool(),
      new SyncNetworkTool(),
      new GetNetworkTool(),
      new ManageConversationTool(),
      new CheckConnectionStatusTool(),
      new RetrieveConnectionsTool(),
      new SendConnectionRequestTool(),
      new WithdrawConnectionRequestTool(),
      new RetrievePendingRequestsTool(),
      new RetrieveInvitationsTool(),
      new AcceptInvitationTool(),
      new IgnoreInvitationTool(),
      new RemoveConnectionTool(),
      new SearchCompaniesTool(),
      new SearchPeopleTool(),
      new SearchJobsTool(),
      new FetchCompanyTool(),
      new FetchPersonTool(),
      new FetchPostTool(),
      new FetchJobTool(),
      new ReactToPostTool(),
      new CommentOnPostTool(),
      new CreatePostTool(),
      new RetrieveFeedTool(),
      new RetrieveSSITool(),
      new RetrievePerformanceTool(),
      // Sales Navigator tools
      new NvSendMessageTool(),
      new NvGetConversationTool(),
      new NvSyncInboxTool(),
      new NvManageConversationTool(),
      new NvSearchCompaniesTool(),
      new NvSearchPeopleTool(),
      new NvFetchCompanyTool(),
      new NvFetchPersonTool(),
      // Other tools
      new ExecuteCustomWorkflowTool(),
      new GetWorkflowResultTool(),
      new GetApiUsageTool(),
    ];

    this.adminTools = [
      new AdminGetSubscriptionStatusTool(),
      new AdminGetSeatsTool(),
      new AdminSetSeatsTool(),
      new AdminGetAccountsTool(),
      new AdminReparseAccountInfoTool(),
      new AdminCreateReconnectionSessionTool(),
      new AdminConnectAccountTool(),
      new AdminGetConnectionSessionTool(),
      new AdminCancelConnectionSessionTool(),
      new AdminDisconnectAccountTool(),
      new AdminRegenerateTokenTool(),
      new AdminGetLimitsDefaultsTool(),
      new AdminGetLimitsTool(),
      new AdminGetLimitsUsageTool(),
      new AdminSetLimitsTool(),
      new AdminDeleteLimitsTool(),
      new AdminResetLimitsTool(),
    ];
  }

  public toolByName(name: string): TRegisteredLinkedApiTool | undefined {
    return this.tools.find((tool) => tool.name === name);
  }

  public adminToolByName(name: string): AdminTool<unknown, unknown> | undefined {
    return this.adminTools.find((tool) => tool.name === name);
  }
}
