import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Injectable, Logger } from '@nestjs/common';
import { LinkedApi, LinkedApiError, TLinkedApiConfig } from 'linkedapi-node';
import { buildLinkedApiHttpClient } from 'linkedapi-node/dist/core';

import { LinkedApiTools } from './linked-api-tools';
import { defineRequestTimeoutInSeconds } from './utils/define-request-timeout';
import { handleLinkedApiError } from './utils/handle-linked-api-error';
import {
  CallToolResult,
  ExtendedCallToolRequest,
  LinkedApiProgressNotification,
} from './utils/types';

@Injectable()
export class LinkedApiMCPServer {
  public readonly tools: LinkedApiTools;
  private readonly logger = new Logger(LinkedApiMCPServer.name);

  constructor(progressCallback: (notification: LinkedApiProgressNotification) => void) {
    this.tools = new LinkedApiTools(progressCallback);
  }

  public getTools(): Tool[] {
    return this.tools.tools.map((tool) => tool.getTool());
  }

  public async executeWithTokens(
    request: ExtendedCallToolRequest['params'],
    { linkedApiToken, identificationToken, mcpClient }: TLinkedApiConfig & { mcpClient: string },
  ): Promise<CallToolResult> {
    const workflowTimeout = defineRequestTimeoutInSeconds(mcpClient) * 1000;
    this.logger.log(
      {
        toolName: request.name,
        arguments: request.arguments,
        mcpClient,
        workflowTimeout,
      },
      'Tool execution started',
    );
    const linkedapi = new LinkedApi(
      buildLinkedApiHttpClient(
        {
          linkedApiToken: linkedApiToken,
          identificationToken: identificationToken,
        },
        'mcp',
      ),
    );

    const { name: toolName, arguments: args, _meta } = request;
    const progressToken = _meta?.progressToken;

    const startTime = Date.now();
    try {
      const tool = this.tools.toolByName(toolName)!;
      const params = tool.validate(args);
      const { data, errors } = await tool.execute({
        linkedapi,
        args: params,
        workflowTimeout,
        progressToken,
      });
      const endTime = Date.now();
      const duration = `${((endTime - startTime) / 1000).toFixed(2)} seconds`;
      if (errors.length > 0 && !data) {
        this.logger.error(
          {
            toolName,
            duration,
            errors,
          },
          'Tool execution failed',
        );
        return {
          content: [
            {
              type: 'text' as const,
              text: errors.map((e) => e.message).join('\n'),
            },
          ],
        };
      }
      this.logger.log(
        {
          toolName,
          duration,
          data,
        },
        'Tool execution successful',
      );
      if (data) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Completed',
          },
        ],
      };
    } catch (error) {
      const duration = this.calculateDuration(startTime);
      if (error instanceof LinkedApiError) {
        const body = handleLinkedApiError(error);
        this.logger.error(
          {
            toolName,
            duration,
            body,
          },
          'Tool execution failed with Linked API error',
        );
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
      this.logger.error(
        {
          toolName,
          duration,
          error: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Tool execution failed with unknown error',
      );

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error executing ${toolName}: ${errorMessage}`,
          },
        ],
      };
    }
  }

  private calculateDuration(startTime: number): string {
    const endTime = Date.now();
    return `${((endTime - startTime) / 1000).toFixed(2)} seconds`;
  }
}
