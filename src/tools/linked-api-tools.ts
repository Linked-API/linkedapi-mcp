import { ToolHandler } from '../types/index.js';

import { nvFetchCompanyTool } from './sales-navigator/fetch-company.js';
import { nvFetchPersonTool } from './sales-navigator/fetch-person.js';
import { nvSearchCompaniesTool } from './sales-navigator/search-companies.js';
import { nvSearchPeopleTool } from './sales-navigator/search-people.js';
import { nvSendMessageTool } from './sales-navigator/send-message.js';
import { nvSyncConversationTool } from './sales-navigator/sync-conversation.js';
import { checkConnectionStatusTool } from './standard/check-connection-status.js';
import { commentOnPostTool } from './standard/comment-on-post.js';
import { executeCustomWorkflowTool } from './standard/execute-custom-workflow.js';
import { fetchCompanyTool } from './standard/fetch-company.js';
import { fetchPersonTool } from './standard/fetch-person.js';
import { fetchPostTool } from './standard/fetch-post.js';
import { getApiUsageStatsTool } from './standard/get-api-usage-stats.js';
import { getWorkflowResultTool } from './standard/get-workflow-result.js';
import { pollConversationsTool } from './standard/poll-conversations.js';
import { reactToPostTool } from './standard/react-to-post.js';
import { removeConnectionTool } from './standard/remove-connection.js';
import { retrieveConnectionsTool } from './standard/retrieve-connections.js';
import { retrievePendingRequestsTool } from './standard/retrieve-pending-requests.js';
import { retrievePerformanceTool } from './standard/retrieve-performance.js';
import { retrieveSSITool } from './standard/retrieve-ssi.js';
import { searchCompaniesTool } from './standard/search-companies.js';
import { searchPeopleTool } from './standard/search-people.js';
import { sendConnectionRequestTool } from './standard/send-connection-request.js';
import { sendMessageTool } from './standard/send-message.js';
import { syncConversationTool } from './standard/sync-conversation.js';
import { withdrawConnectionRequestTool } from './standard/withdraw-connection-request.js';

export class LinkedApiTools {
  public readonly tools: Map<string, ToolHandler>;

  constructor() {
    this.tools = new Map([
      // Standard tools
      [sendMessageTool.tool.name, sendMessageTool],
      [syncConversationTool.tool.name, syncConversationTool],
      [pollConversationsTool.tool.name, pollConversationsTool],
      [checkConnectionStatusTool.tool.name, checkConnectionStatusTool],
      [sendConnectionRequestTool.tool.name, sendConnectionRequestTool],
      [withdrawConnectionRequestTool.tool.name, withdrawConnectionRequestTool],
      [retrievePendingRequestsTool.tool.name, retrievePendingRequestsTool],
      [retrieveConnectionsTool.tool.name, retrieveConnectionsTool],
      [removeConnectionTool.tool.name, removeConnectionTool],
      [searchCompaniesTool.tool.name, searchCompaniesTool],
      [searchPeopleTool.tool.name, searchPeopleTool],
      [fetchCompanyTool.tool.name, fetchCompanyTool],
      [fetchPersonTool.tool.name, fetchPersonTool],
      [fetchPostTool.tool.name, fetchPostTool],
      [reactToPostTool.tool.name, reactToPostTool],
      [commentOnPostTool.tool.name, commentOnPostTool],
      [retrieveSSITool.tool.name, retrieveSSITool],
      [retrievePerformanceTool.tool.name, retrievePerformanceTool],
      // Sales Navigator tools
      [nvSendMessageTool.tool.name, nvSendMessageTool],
      [nvSyncConversationTool.tool.name, nvSyncConversationTool],
      [nvFetchPersonTool.tool.name, nvFetchPersonTool],
      [nvFetchCompanyTool.tool.name, nvFetchCompanyTool],
      [nvSearchCompaniesTool.tool.name, nvSearchCompaniesTool],
      [nvSearchPeopleTool.tool.name, nvSearchPeopleTool],
      // Other tools
      [executeCustomWorkflowTool.tool.name, executeCustomWorkflowTool],
      [getWorkflowResultTool.tool.name, getWorkflowResultTool],
      [getApiUsageStatsTool.tool.name, getApiUsageStatsTool],
    ]);
  }
}
