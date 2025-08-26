import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LinkedApi, LinkedApiError, LinkedApiWorkflowTimeoutError } from 'linkedapi-node';

import { LinkedApiTools } from './tools/linked-api-tools';
import {
  CallToolResult,
  ExtendedCallToolRequest,
  LinkedApiServerConfig,
  ProgressNotification,
  ToolHandler,
} from './types';
import { debugLog } from './utils/debug-log';

export class LinkedApiMCPServer {
  private linkedapi: LinkedApi;
  private toolHandlers: Map<string, ToolHandler>;
  private progressCallback?: (notification: ProgressNotification) => void;

  constructor(config: LinkedApiServerConfig) {
    this.linkedapi = new LinkedApi({
      linkedApiToken: config.linkedApiToken!,
      identificationToken: config.identificationToken!,
    });

    this.toolHandlers = new LinkedApiTools().tools;

    debugLog('LinkedApiMCPServer initialized successfully');
  }

  public setProgressCallback(callback: (notification: ProgressNotification) => void) {
    this.progressCallback = callback;
  }

  private sendProgress(
    progressToken: string | number,
    progress: number,
    total?: number,
    message?: string,
  ) {
    if (this.progressCallback) {
      this.progressCallback({
        progressToken,
        progress,
        total,
        message,
      });
    }
  }

  public getTools(): Tool[] {
    return Array.from(this.toolHandlers.values()).map((t) => t.tool);
  }

  public async callTool(request: ExtendedCallToolRequest['params']): Promise<CallToolResult> {
    const { name, arguments: args, _meta } = request;
    const progressToken = _meta?.progressToken;

    debugLog(`Calling tool: ${name}`, {
      hasArgs: !!args,
      hasProgressToken: !!progressToken,
      args: args,
    });

    const toolHandler = this.toolHandlers.get(name);
    if (!toolHandler) {
      const error = `Unknown tool: ${name}`;
      debugLog(error);
      throw new Error(error);
    }

    try {
      const progressCallback = progressToken
        ? (progress: ProgressNotification) => {
            this.sendProgress(progressToken, progress.progress, progress.total, progress.message);
          }
        : undefined;

      const result = await toolHandler.handler(this.linkedapi, args || {}, progressCallback);
      return result;
    } catch (error) {
      debugLog(`Tool ${name} execution failed`, {
        error: error,
        isLinkedApiWorkflowTimeoutError: error instanceof LinkedApiWorkflowTimeoutError,
        isLinkedApiError: error instanceof LinkedApiError,
      });
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLog(`Tool ${name} execution failed`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof LinkedApiWorkflowTimeoutError) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  message: error.message,
                  workflowId: error.workflowId,
                  operationName: error.operationName,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error executing ${name}: ${errorMessage}`,
          },
        ],
      };
    }
  }
}
