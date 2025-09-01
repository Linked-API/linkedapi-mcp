import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LinkedApi, LinkedApiError, TLinkedApiConfig } from 'linkedapi-node';
import { buildLinkedApiHttpClient } from 'linkedapi-node/dist/core';

import { LinkedApiTools } from './linked-api-tools';
import { debugLog } from './utils/debug-log';
import { handleLinkedApiError } from './utils/handle-linked-api-error';
import {
  CallToolResult,
  ExtendedCallToolRequest,
  LinkedApiProgressNotification,
} from './utils/types';

export class LinkedApiMCPServer {
  private tools: LinkedApiTools;

  constructor(progressCallback: (notification: LinkedApiProgressNotification) => void) {
    this.tools = new LinkedApiTools(progressCallback);
  }

  public getTools(): Tool[] {
    return this.tools.tools.map((tool) => tool.getTool());
  }

  public async executeWithTokens(
    request: ExtendedCallToolRequest['params'],
    config: TLinkedApiConfig,
  ): Promise<CallToolResult> {
    const linkedApi = new LinkedApi(
      buildLinkedApiHttpClient(
        {
          linkedApiToken: config.linkedApiToken!,
          identificationToken: config.identificationToken!,
        },
        'mcp',
      ),
    );

    const { name, arguments: args, _meta } = request;
    const progressToken = _meta?.progressToken;

    try {
      const tool = this.tools.toolByName(name)!;
      const params = tool.validate(args);
      const { data, errors } = await tool.execute(linkedApi, params, progressToken);
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
        const body = handleLinkedApiError(error);
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
