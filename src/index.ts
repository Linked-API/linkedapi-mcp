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
import { JsonHTTPServerTransport } from './utils/json-http-transport';
import { logger } from './utils/logger';
import { LinkedApiProgressNotification } from './utils/types';

function deriveClientFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('cursor')) return 'cursor';
  if (ua.includes('windsurf')) return 'windsurf';
  if (ua.includes('vscode') || ua.includes('visual studio code')) return 'vscode';
  if (ua.includes('chatgpt') || ua.includes('openai')) return 'chatgpt';
  if (ua.includes('curl')) return 'curl';
  if (ua.includes('postman')) return 'postman';
  if (
    ua.includes('mozilla') ||
    ua.includes('chrome') ||
    ua.includes('safari') ||
    ua.includes('firefox')
  )
    return 'browser';
  return userAgent;
}

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
    const requestInfoAny = (
      extra as unknown as { requestInfo?: { method?: string; transport?: string } }
    )?.requestInfo;
    const method = requestInfoAny?.method ?? 'N/A';
    const transportType = (requestInfoAny?.transport as 'http' | 'sse' | undefined) ?? 'N/A';
    logger.info(
      {
        method,
        transport: transportType,
      },
      'Tool request received',
    );

    try {
      const localLinkedApiToken = process.env.LINKED_API_TOKEN;
      const localIdentificationToken = process.env.IDENTIFICATION_TOKEN;
      const headers = extra?.requestInfo?.headers ?? {};
      const linkedApiToken = (headers['linked-api-token'] ?? localLinkedApiToken ?? '') as string;
      const identificationToken = (headers['identification-token'] ??
        localIdentificationToken ??
        '') as string;
      let mcpClient = (headers['client'] ?? '') as string;
      if (!mcpClient) {
        const userAgentHeader = headers['user-agent'];
        if (typeof userAgentHeader === 'string' && userAgentHeader.trim().length > 0) {
          mcpClient = deriveClientFromUserAgent(userAgentHeader);
        }
      }

      const result = await linkedApiServer.executeWithTokens(request.params, {
        linkedApiToken,
        identificationToken,
        mcpClient,
      });
      return result;
    } catch (error) {
      logger.error(
        {
          toolName: request.params.name,
          error: error instanceof Error ? error.message : String(error),
        },
        'Critical tool execution error',
      );
      return {
        content: [
          {
            type: 'text',
            text: 'Unknown error. Please try again.',
          },
        ],
      };
    }
  });

  if (hasFlag('--http') || hasFlag('--transport=http')) {
    const port = Number(process.env.PORT ?? getArgValue('--port') ?? 3000);
    const host = process.env.HOST ?? getArgValue('--host') ?? '0.0.0.0';
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
        // Set query parameters to headers if they are not set
        const linkedApiTokenQP = url.searchParams.get('linked-api-token');
        const identificationTokenQP = url.searchParams.get('identification-token');
        const mcpClient = url.searchParams.get('client');
        if (!req.headers['linked-api-token'] && linkedApiTokenQP) {
          req.headers['linked-api-token'] = linkedApiTokenQP;
        }
        if (!req.headers['identification-token'] && identificationTokenQP) {
          req.headers['identification-token'] = identificationTokenQP;
        }
        if (!req.headers['client'] && mcpClient) {
          req.headers['client'] = mcpClient;
        }
        await transport.handleRequest(req, res);
      } catch (error) {
        logger.error(
          {
            error: error instanceof Error ? error.message : String(error),
          },
          'HTTP request handling failed',
        );
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    httpServer.listen(port, host, () => {
      logger.info({ host }, `HTTP transport listening on port ${port}`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('stdio transport connected');
  }
}

main().catch((error) => {
  logger.error(error, 'Fatal error');
  process.exit(1);
});
