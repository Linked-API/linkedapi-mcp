import { LinkedApi, LinkedApiAdmin, LinkedApiError, TLinkedApiConfig } from '@linkedapi/node';
import { buildLinkedApiHttpClient } from '@linkedapi/node/dist/core';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { LinkedApiTools } from './linked-api-tools';
import { handleLinkedApiError } from './utils/handle-linked-api-error';
import { logger } from './utils/logger';
import { CallToolResult, ExtendedCallToolRequest } from './utils/types';

const BACKGROUND_WORKFLOW_DESCRIPTION =
  `Linked API actions are queued into a cloud-browser workflow and may take several minutes. The server returns immediately after starting the workflow with {status: 'pending'|'running', workflowId, operationName, message}. To retrieve the final result, call get_workflow_result with the returned workflowId and operationName — it will long-poll until completion or the request budget elapses, then return either the final result or another in-progress snapshot. Do not retry the original tool while a workflow is still running; that creates duplicate queued work.` as const;
const NON_WORKFLOW_TOOL_NAMES = new Set<string>(['get_workflow_result', 'get_api_usage'] as const);

interface TExecuteWithTokensOptions extends TLinkedApiConfig {
  mcpClient: string;
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
    { linkedApiToken, identificationToken, mcpClient }: TExecuteWithTokensOptions,
  ): Promise<CallToolResult> {
    logger.info(
      {
        toolName: request.name,
        arguments: request.arguments,
        mcpClient,
      },
      'Tool execution started',
    );
    const { name: toolName, arguments: args } = request;

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
          return this.text('Completed');
        }
        return this.text(JSON.stringify(result, null, 2));
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
      const result = await tool.execute({
        linkedapi,
        args: params as never,
        mcpClient,
      });
      const duration = this.calculateDuration(startTime);

      if ('workflowStatus' in result) {
        const inProgressBody = {
          status: result.workflowStatus,
          workflowId: result.workflowId,
          operationName: result.operationName,
          message: result.message,
        };
        logger.info(
          {
            toolName,
            duration,
            body: inProgressBody,
          },
          'Tool execution returned in-progress snapshot',
        );
        return this.text(JSON.stringify(inProgressBody, null, 2));
      }

      const { data, errors } = result;
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
        return this.text(JSON.stringify(data, null, 2));
      }
      return this.text('Completed');
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
          isError: true,
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

      return this.text(`Error executing ${toolName}: ${errorMessage}`);
    }
  }

  private text(text: string): CallToolResult {
    return {
      content: [
        {
          type: 'text' as const,
          text,
        },
      ],
    };
  }

  private calculateDuration(startTime: number): string {
    const endTime = Date.now();
    return `${((endTime - startTime) / 1000).toFixed(2)} seconds`;
  }
}
