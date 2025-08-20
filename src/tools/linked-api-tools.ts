import { sendMessageTool } from "./standard/send-message.js";
import { syncConversationTool } from "./standard/sync-conversation.js";
import { pollConversationsTool } from "./standard/poll-conversations.js";
import { fetchPersonTool } from "./standard/fetch-person.js";
import { fetchCompanyTool } from "./standard/fetch-company.js";
import { fetchPostTool } from "./standard/fetch-post.js";
import { searchCompaniesTool } from "./standard/search-companies.js";
import { searchPeopleTool } from "./standard/search-people.js";
import { sendConnectionRequestTool } from "./standard/send-connection-request.js";
import { checkConnectionStatusTool } from "./standard/check-connection-status.js";
import { withdrawConnectionRequestTool } from "./standard/withdraw-connection-request.js";
import { retrievePendingRequestsTool } from "./standard/retrieve-pending-requests.js";
import { retrieveConnectionsTool } from "./standard/retrieve-connections.js";
import { removeConnectionTool } from "./standard/remove-connection.js";
import { reactToPostTool } from "./standard/react-to-post.js";
import { commentOnPostTool } from "./standard/comment-on-post.js";
import { retrieveSSITool } from "./standard/retrieve-ssi.js";
import { retrievePerformanceTool } from "./standard/retrieve-performance.js";
import { getApiUsageStatsTool } from "./standard/get-api-usage-stats.js";
import { executeCustomWorkflowTool } from "./standard/execute-custom-workflow.js";
import { getWorkflowResultTool } from "./standard/get-workflow-result.js";
import { restoreWorkflowTool } from "./standard/restore-workflow.js";
import { nvSendMessageTool } from "./sales-navigator/send-message.js";
import { nvSyncConversationTool } from "./sales-navigator/sync-conversation.js";
import { nvFetchPersonTool } from "./sales-navigator/fetch-person.js";
import { nvFetchCompanyTool } from "./sales-navigator/fetch-company.js";
import { nvSearchCompaniesTool } from "./sales-navigator/search-companies.js";
import { nvSearchPeopleTool } from "./sales-navigator/search-people.js";
import { ToolHandler } from "../types/index.js";

export class LinkedApiTools {
  public readonly tools: Map<string, ToolHandler>;

  constructor() {
    this.tools = new Map([
      // Standard tools
      [sendMessageTool.tool.name, sendMessageTool],
      [syncConversationTool.tool.name, syncConversationTool],
      [pollConversationsTool.tool.name, pollConversationsTool],
      [fetchPersonTool.tool.name, fetchPersonTool],
      [fetchCompanyTool.tool.name, fetchCompanyTool],
      [fetchPostTool.tool.name, fetchPostTool],
      [searchCompaniesTool.tool.name, searchCompaniesTool],
      [searchPeopleTool.tool.name, searchPeopleTool],
      [sendConnectionRequestTool.tool.name, sendConnectionRequestTool],
      [checkConnectionStatusTool.tool.name, checkConnectionStatusTool],
      [withdrawConnectionRequestTool.tool.name, withdrawConnectionRequestTool],
      [retrievePendingRequestsTool.tool.name, retrievePendingRequestsTool],
      [retrieveConnectionsTool.tool.name, retrieveConnectionsTool],
      [removeConnectionTool.tool.name, removeConnectionTool],
      [reactToPostTool.tool.name, reactToPostTool],
      [commentOnPostTool.tool.name, commentOnPostTool],
      [retrieveSSITool.tool.name, retrieveSSITool],
      [retrievePerformanceTool.tool.name, retrievePerformanceTool],
      [getApiUsageStatsTool.tool.name, getApiUsageStatsTool],
      // Sales Navigator tools
      [nvSendMessageTool.tool.name, nvSendMessageTool],
      [nvSyncConversationTool.tool.name, nvSyncConversationTool],
      [nvFetchPersonTool.tool.name, nvFetchPersonTool],
      [nvFetchCompanyTool.tool.name, nvFetchCompanyTool],
      [nvSearchCompaniesTool.tool.name, nvSearchCompaniesTool],
      [nvSearchPeopleTool.tool.name, nvSearchPeopleTool],
      // Advanced tools
      [executeCustomWorkflowTool.tool.name, executeCustomWorkflowTool],
      [getWorkflowResultTool.tool.name, getWorkflowResultTool],
      [restoreWorkflowTool.tool.name, restoreWorkflowTool],
    ]);
  }
}
