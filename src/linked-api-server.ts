import { LinkedApi, LinkedApiAdmin, LinkedApiError, TLinkedApiConfig } from '@linkedapi/node';
import { buildLinkedApiHttpClient } from '@linkedapi/node/dist/core';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { LinkedApiTools } from './linked-api-tools';
import { defineRequestTimeoutInSeconds } from './utils/define-request-timeout';
import { handleLinkedApiError } from './utils/handle-linked-api-error';
import { logger } from './utils/logger';
import {
  CallToolResult,
  ExtendedCallToolRequest,
  LinkedApiProgressNotification,
} from './utils/types';

const BACKGROUND_WORKFLOW_DESCRIPTION =
  `Linked API actions are queued into a cloud-browser workflow and may take several minutes. This is normal LinkedIn automation behavior, not a failed request. If the response contains workflowId and operationName, do not retry this tool; call get_workflow_result with those exact values until the final result is returned.` as const;
const NON_WORKFLOW_TOOL_NAMES = new Set<string>(['get_workflow_result', 'get_api_usage'] as const);
const NOOP_PROGRESS_CALLBACK = (_notification: LinkedApiProgressNotification): void => {};

interface TExecuteWithTokensOptions extends TLinkedApiConfig {
  mcpClient: string;
  progressCallback?: (notification: LinkedApiProgressNotification) => void;
}

export class LinkedApiMCPServer {
  private tools: LinkedApiTools;

  constructor() {
    this.tools = new LinkedApiTools();
  }

  public getTools(): Tool[] {
    const linkedApiTools = this.tools.tools.map((tool) => {
      const definition = tool.getTool();
      if (NON_WORKFLOW_TOOL_NAMES.has(definition.name)) {
        return definition;
      }

      return {
        ...definition,
        description: `${definition.description}\n\n${BACKGROUND_WORKFLOW_DESCRIPTION}`,
      };
    });
    const adminTools = this.tools.adminTools.map((tool) => tool.getTool());
    return [...linkedApiTools, ...adminTools];
  }

  public async executeWithTokens(
    request: ExtendedCallToolRequest['params'],
    {
      linkedApiToken,
      identificationToken,
      mcpClient,
      progressCallback = NOOP_PROGRESS_CALLBACK,
    }: TExecuteWithTokensOptions,
  ): Promise<CallToolResult> {
    const workflowTimeout = defineRequestTimeoutInSeconds(mcpClient) * 1000;
    logger.info(
      {
        toolName: request.name,
        arguments: request.arguments,
        mcpClient,
        workflowTimeout,
      },
      'Tool execution started',
    );
    const { name: toolName, arguments: args, _meta } = request;
    const progressToken = _meta?.progressToken;

    const startTime = Date.now();
    try {
      const adminTool = this.tools.adminToolByName(toolName);
      if (adminTool) {
        const admin = new LinkedApiAdmin({
          linkedApiToken,
          client: 'mcp',
        });
        const params = adminTool.validate(args);
        const result = await adminTool.execute({
          admin,
          args: params,
        });
        const duration = this.calculateDuration(startTime);
        logger.info(
          {
            toolName,
            duration,
            data: result,
          },
          'Tool execution successful',
        );
        if (result === undefined) {
          return {
            content: [
              {
                type: 'text' as const,
                text: 'Completed',
              },
            ],
          };
        }
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      const linkedapi = new LinkedApi(
        buildLinkedApiHttpClient(
          {
            linkedApiToken: linkedApiToken,
            identificationToken: identificationToken,
          },
          'mcp',
        ),
      );

      const tool = this.tools.toolByName(toolName);
      if (!tool) {
        throw new Error(`Unknown tool: ${toolName}`);
      }
      const params = tool.validate(args);
      const { data, errors } = await tool.execute({
        linkedapi,
        args: params as never,
        workflowTimeout,
        progressToken,
        progressCallback,
      });
      const endTime = Date.now();
      const duration = `${((endTime - startTime) / 1000).toFixed(2)} seconds`;
      if (errors.length > 0 && !data) {
        logger.error(
          {
            toolName,
            duration,
            errors,
          },
          'Tool execution failed',
        );
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: errors.map((e) => e.message).join('\n'),
            },
          ],
        };
      }
      logger.info(
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
        logger.error(
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
          structuredContent: body,
          isError: error.type !== 'workflowTimeout',
        };
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(
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
