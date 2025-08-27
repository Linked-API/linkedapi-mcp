#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { LinkedApiMCPServer } from './linked-api-server';
import { availablePrompts, getPromptContent, systemPrompt } from './prompts';
import { debugLog } from './utils/debug-log';
import { LinkedApiProgressNotification } from './utils/types';

async function main() {
  const linkedApiToken = process.env.LINKED_API_TOKEN;
  const identificationToken = process.env.IDENTIFICATION_TOKEN;

  const server = new Server(
    {
      name: 'linkedapi-mcp',
      version: '1.0.0',
      description: 'MCP Server for Linked API (https://linkedapi.io)',
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
      },
      instructions: systemPrompt,
    },
  );

  const progressCallback = (_notification: LinkedApiProgressNotification) => {};

  const linkedApiServer = new LinkedApiMCPServer(
    {
      linkedApiToken: linkedApiToken!,
      identificationToken: identificationToken!,
    },
    progressCallback,
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = linkedApiServer.getTools();
    return {
      tools,
    };
  });

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: availablePrompts,
    };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name } = request.params;

    try {
      const content = name === 'performance_guidelines' ? systemPrompt : getPromptContent(name);

      return {
        description: `Linked API MCP: ${name.replace('_', ' ')}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: content,
            },
          },
        ],
      };
    } catch {
      throw new Error(`Unknown prompt: ${name}`);
    }
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    debugLog('Tool request received', {
      toolName: request.params.name,
      arguments: request.params.arguments,
      progressToken: request.params._meta?.progressToken,
    });

    try {
      const result = await linkedApiServer.callTool(request.params);
      return result;
    } catch (error) {
      debugLog('Tool execution failed', {
        toolName: request.params.name,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  debugLog('Fatal error', error);
  process.exit(1);
});
