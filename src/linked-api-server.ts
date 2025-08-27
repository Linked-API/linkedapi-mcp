import { Tool } from '@modelcontextprotocol/sdk/types.js';
import {
  LinkedApi,
  LinkedApiError,
  LinkedApiWorkflowTimeoutError,
  TLinkedApiConfig,
} from 'linkedapi-node';
import { buildLinkedApiHttpClient } from 'linkedapi-node/dist/core';

import { LinkedApiTools } from './tools/linked-api-tools';
import { CallToolResult, ExtendedCallToolRequest, LinkedApiProgressNotification } from './types';
import { debugLog } from './utils/debug-log';

export class LinkedApiMCPServer {
  private linkedapi: LinkedApi;
  private tools: LinkedApiTools;
  private progressCallback: (notification: LinkedApiProgressNotification) => void;

  constructor(
    config: TLinkedApiConfig,
    progressCallback: (notification: LinkedApiProgressNotification) => void,
  ) {
    this.linkedapi = new LinkedApi(
      buildLinkedApiHttpClient(
        {
          linkedApiToken: config.linkedApiToken!,
          identificationToken: config.identificationToken!,
        },
        'mcp',
      ),
    );
    this.progressCallback = progressCallback;

    this.tools = new LinkedApiTools(this.linkedapi, this.progressCallback);
  }

  public getTools(): Tool[] {
    return [...this.tools.operationTools.map((t) => t.getTool())];
  }

  public async callTool(request: ExtendedCallToolRequest['params']): Promise<CallToolResult> {
    const { name, arguments: args, _meta } = request;
    const progressToken = _meta?.progressToken;

    try {
      const tool = this.tools.toolByName(name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }
      const params = tool.validate(args);
      const { data, errors } = await tool.execute(params, progressToken);
      if (errors.length > 0 && !data) {
        return {
          content: [
            {
              type: 'text' as const,
              text: errors.map((e) => e.message).join('\n'),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof LinkedApiError) {
        let body: unknown = error;
        if (error instanceof LinkedApiWorkflowTimeoutError) {
          const { message, workflowId, operationName } = error;
          body = {
            message,
            workflowId,
            operationName,
          };
        }
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(body, null, 2),
            },
          ],
        };
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLog(`Tool ${name} execution failed`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

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
