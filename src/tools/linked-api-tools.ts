import LinkedApi from 'linkedapi-node';

import { LinkedApiProgressNotification } from '../types/index.js';

import { LinkedApiTool } from './linked-api-tool.js';
import { CheckConnectionStatusTool } from './operation/check-connection-status.js';
import { CommentOnPostTool } from './operation/comment-on-post.js';
import { ExecuteCustomWorkflowTool } from './operation/execute-custom-workflow.js';
import { FetchCompanyTool } from './operation/fetch-company.js';
import { FetchPersonTool } from './operation/fetch-person.js';
import { FetchPostTool } from './operation/fetch-post.js';
import { NvFetchCompanyTool } from './operation/nv-fetch-company.js';
import { NvFetchPersonTool } from './operation/nv-fetch-person.js';
import { NvSearchCompaniesTool } from './operation/nv-search-companies.js';
import { NvSearchPeopleTool } from './operation/nv-search-people.js';
import { NvSendMessageTool } from './operation/nv-send-message.js';
import { NvSyncConversationTool } from './operation/nv-sync-conversation.js';
import { ReactToPostTool } from './operation/react-to-post.js';
import { RemoveConnectionTool } from './operation/remove-connection.js';
import { RetrieveConnectionsTool } from './operation/retrieve-connections.js';
import { RetrievePendingRequestsTool } from './operation/retrieve-pending-requests.js';
import { RetrievePerformanceTool } from './operation/retrieve-performance.js';
import { RetrieveSSITool } from './operation/retrieve-ssi.js';
import { SearchCompaniesTool } from './operation/search-companies.js';
import { SearchPeopleTool } from './operation/search-people.js';
import { SendConnectionRequestTool } from './operation/send-connection-request.js';
import { SendMessageTool } from './operation/send-message.js';
import { SyncConversationTool } from './operation/sync-conversation.js';
import { WithdrawConnectionRequestTool } from './operation/withdraw-connection-request.js';
import { GetApiUsageTool } from './other/get-api-usage-stats.js';
import { GetWorkflowResultTool } from './other/get-workflow-result.js';
import { PollConversationsTool } from './other/poll-conversations.js';

export class LinkedApiTools {
  public readonly operationTools: ReadonlyArray<LinkedApiTool<unknown, unknown>>;

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    this.operationTools = [
      // Standard tools
      new SendMessageTool(linkedapi, progressCallback),
      new SyncConversationTool(linkedapi, progressCallback),
      new CheckConnectionStatusTool(linkedapi, progressCallback),
      new RetrieveConnectionsTool(linkedapi, progressCallback),
      new SendConnectionRequestTool(linkedapi, progressCallback),
      new WithdrawConnectionRequestTool(linkedapi, progressCallback),
      new RetrievePendingRequestsTool(linkedapi, progressCallback),
      new RemoveConnectionTool(linkedapi, progressCallback),
      new SearchCompaniesTool(linkedapi, progressCallback),
      new SearchPeopleTool(linkedapi, progressCallback),
      new FetchCompanyTool(linkedapi, progressCallback),
      new FetchPersonTool(linkedapi, progressCallback),
      new FetchPostTool(linkedapi, progressCallback),
      new ReactToPostTool(linkedapi, progressCallback),
      new CommentOnPostTool(linkedapi, progressCallback),
      new RetrieveSSITool(linkedapi, progressCallback),
      new RetrievePerformanceTool(linkedapi, progressCallback),
      // Sales Navigator tools
      new NvSendMessageTool(linkedapi, progressCallback),
      new NvSyncConversationTool(linkedapi, progressCallback),
      new NvSearchCompaniesTool(linkedapi, progressCallback),
      new NvSearchPeopleTool(linkedapi, progressCallback),
      new NvFetchCompanyTool(linkedapi, progressCallback),
      new NvFetchPersonTool(linkedapi, progressCallback),
      // Other tools
      new ExecuteCustomWorkflowTool(linkedapi, progressCallback),
      new GetWorkflowResultTool(linkedapi, progressCallback),
      new GetApiUsageTool(linkedapi, progressCallback),
      new PollConversationsTool(linkedapi, progressCallback),
    ];
  }

  public toolByName(name: string): LinkedApiTool<unknown, unknown> | undefined {
    return this.operationTools.find((tool) => tool.name === name);
  }
}
