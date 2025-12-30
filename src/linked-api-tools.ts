import { CheckConnectionStatusTool } from './tools/check-connection-status.js';
import { CommentOnPostTool } from './tools/comment-on-post.js';
import { CreatePostTool } from './tools/create-post.js';
import { ExecuteCustomWorkflowTool } from './tools/execute-custom-workflow.js';
import { FetchCompanyTool } from './tools/fetch-company.js';
import { FetchPersonTool } from './tools/fetch-person.js';
import { FetchPostTool } from './tools/fetch-post.js';
import { GetApiUsageTool } from './tools/get-api-usage-stats.js';
import { GetConversationTool } from './tools/get-conversation.js';
import { GetWorkflowResultTool } from './tools/get-workflow-result.js';
import { NvFetchCompanyTool } from './tools/nv-fetch-company.js';
import { NvFetchPersonTool } from './tools/nv-fetch-person.js';
import { NvGetConversationTool } from './tools/nv-get-conversation.js';
import { NvSearchCompaniesTool } from './tools/nv-search-companies.js';
import { NvSearchPeopleTool } from './tools/nv-search-people.js';
import { NvSendMessageTool } from './tools/nv-send-message.js';
import { ReactToPostTool } from './tools/react-to-post.js';
import { RemoveConnectionTool } from './tools/remove-connection.js';
import { RetrieveConnectionsTool } from './tools/retrieve-connections.js';
import { RetrievePendingRequestsTool } from './tools/retrieve-pending-requests.js';
import { RetrievePerformanceTool } from './tools/retrieve-performance.js';
import { RetrieveSSITool } from './tools/retrieve-ssi.js';
import { SearchCompaniesTool } from './tools/search-companies.js';
import { SearchPeopleTool } from './tools/search-people.js';
import { SendConnectionRequestTool } from './tools/send-connection-request.js';
import { SendMessageTool } from './tools/send-message.js';
import { WithdrawConnectionRequestTool } from './tools/withdraw-connection-request.js';
import { LinkedApiTool } from './utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from './utils/types.js';

export class LinkedApiTools {
  public readonly tools: ReadonlyArray<LinkedApiTool<unknown, unknown>>;

  constructor(progressCallback: (progress: LinkedApiProgressNotification) => void) {
    this.tools = [
      // Standard tools
      new SendMessageTool(progressCallback),
      new GetConversationTool(progressCallback),
      new CheckConnectionStatusTool(progressCallback),
      new RetrieveConnectionsTool(progressCallback),
      new SendConnectionRequestTool(progressCallback),
      new WithdrawConnectionRequestTool(progressCallback),
      new RetrievePendingRequestsTool(progressCallback),
      new RemoveConnectionTool(progressCallback),
      new SearchCompaniesTool(progressCallback),
      new SearchPeopleTool(progressCallback),
      new FetchCompanyTool(progressCallback),
      new FetchPersonTool(progressCallback),
      new FetchPostTool(progressCallback),
      new ReactToPostTool(progressCallback),
      new CommentOnPostTool(progressCallback),
      new CreatePostTool(progressCallback),
      new RetrieveSSITool(progressCallback),
      new RetrievePerformanceTool(progressCallback),
      // Sales Navigator tools
      new NvSendMessageTool(progressCallback),
      new NvGetConversationTool(progressCallback),
      new NvSearchCompaniesTool(progressCallback),
      new NvSearchPeopleTool(progressCallback),
      new NvFetchCompanyTool(progressCallback),
      new NvFetchPersonTool(progressCallback),
      // Other tools
      new ExecuteCustomWorkflowTool(progressCallback),
      new GetWorkflowResultTool(progressCallback),
      new GetApiUsageTool(progressCallback),
    ];
  }

  public toolByName(name: string): LinkedApiTool<unknown, unknown> | undefined {
    return this.tools.find((tool) => tool.name === name);
  }
}
