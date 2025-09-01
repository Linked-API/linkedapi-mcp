#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import http from 'node:http';

import { LinkedApiMCPServer } from './linked-api-server';
import { availablePrompts, getPromptContent, systemPrompt } from './prompts';
import { debugLog } from './utils/debug-log';
import { JsonHTTPServerTransport } from './utils/json-http-transport';
import { LinkedApiProgressNotification } from './utils/types';

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) return undefined;
  return value;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

async function main() {
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
  const linkedApiServer = new LinkedApiMCPServer(progressCallback);

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

  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    debugLog('Tool request received', {
      toolName: request.params.name,
      arguments: request.params.arguments,
      progressToken: request.params._meta?.progressToken,
    });

    try {
      const localLinkedApiToken = process.env.LINKED_API_TOKEN;
      const localIdentificationToken = process.env.IDENTIFICATION_TOKEN;
      const headers = extra?.requestInfo?.headers ?? {};
      const linkedApiToken = (headers['linked-api-token'] ?? localLinkedApiToken ?? '') as string;
      const identificationToken = (headers['identification-token'] ??
        localIdentificationToken ??
        '') as string;

      const result = await linkedApiServer.executeWithTokens(request.params, {
        linkedApiToken,
        identificationToken,
      });
      return result;
    } catch (error) {
      debugLog('Tool execution failed', {
        toolName: request.params.name,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  });

  if (hasFlag('--http') || hasFlag('--transport=http')) {
    const port = Number(process.env.PORT ?? getArgValue('--port') ?? 3000);
    const host = process.env.HOST ?? getArgValue('--host') ?? '0.0.0.0';
    const basePath = process.env.MCP_HTTP_PATH ?? getArgValue('--path') ?? '/mcp';
    const transport = new JsonHTTPServerTransport();

    await server.connect(transport);

    const httpServer = http.createServer(async (req, res) => {
      try {
        if (!req.url) {
          res.statusCode = 400;
          res.end('Bad Request');
          return;
        }
        const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
        if (url.pathname !== basePath) {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
        await transport.handleRequest(req, res);
      } catch (error) {
        debugLog('HTTP request handling failed', {
          error: error instanceof Error ? error.message : String(error),
        });
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    httpServer.listen(port, host, () => {
      debugLog('HTTP transport listening', {
        host,
        port,
        path: basePath,
      });
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    debugLog('stdio transport connected');
  }
}

main().catch((error) => {
  debugLog('Fatal error', error);
  process.exit(1);
});
