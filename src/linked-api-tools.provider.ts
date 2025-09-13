import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MCP_TOOL_METADATA_KEY, McpRegistryService } from '@rekog/mcp-nest';
import 'reflect-metadata';
import { URL } from 'url';

import { LinkedApiMCPServer } from './linked-api-server';
import { deriveClientFromUserAgent } from './utils/client';

@Injectable()
export class LinkedApiToolsProvider implements OnModuleInit {
  private readonly logger = new Logger(LinkedApiToolsProvider.name);

  constructor(
    private readonly registry: McpRegistryService,
    private readonly linkedApiServer: LinkedApiMCPServer,
    @Inject('MCP_MODULE_ID') private readonly mcpModuleId: string,
  ) {}

  onModuleInit(): void {
    for (const tool of this.linkedApiServer.tools.tools) {
      const methodName = `tool_${tool.name.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      // Dynamically create method for each tool
      Object.defineProperty(this, methodName, {
        value: async (
          args: unknown,
          context: { mcpRequest?: { params?: { _meta?: { progressToken?: string | number } } } },
          rawReq?: { headers?: Record<string, string>; url?: string; method?: string },
        ) => {
          const headers = (rawReq?.headers ?? {}) as Record<string, string>;
          // query params to headers if not set
          if (rawReq?.url) {
            try {
              const url = new URL(rawReq.url, `http://${headers.host ?? 'localhost'}`);
              const linkedApiTokenQP = url.searchParams.get('linked-api-token');
              const identificationTokenQP = url.searchParams.get('identification-token');
              const clientQP = url.searchParams.get('client');
              if (!headers['linked-api-token'] && linkedApiTokenQP) {
                headers['linked-api-token'] = linkedApiTokenQP;
              }
              if (!headers['identification-token'] && identificationTokenQP) {
                headers['identification-token'] = identificationTokenQP;
              }
              if (!headers['client'] && clientQP) {
                headers['client'] = clientQP;
              }
            } catch {
              // ignore URL parsing errors
            }
          }
          const linkedApiToken = headers['linked-api-token'] ?? process.env.LINKED_API_TOKEN ?? '';
          const identificationToken =
            headers['identification-token'] ?? process.env.IDENTIFICATION_TOKEN ?? '';
          let mcpClient = headers['client'] ?? '';
          if (!mcpClient) {
            const ua = headers['user-agent'];
            if (typeof ua === 'string' && ua.trim().length > 0) {
              mcpClient = deriveClientFromUserAgent(ua);
            }
          }
          const progressToken = context?.mcpRequest?.params?._meta?.progressToken;
          this.logger.log(
            { method: rawReq?.method ?? 'N/A',
transport: determineTransport(rawReq) },
            'Tool request received',
          );
          const meta = progressToken ? { progressToken } : undefined;
          return this.linkedApiServer.executeWithTokens(
            { name: tool.name,
arguments: args as Record<string, unknown>,
_meta: meta },
            { linkedApiToken,
identificationToken,
mcpClient },
          );
        },
      });
      const methodRef = (this as Record<string, unknown>)[methodName] as (
        ...args: unknown[]
      ) => unknown;
      const metadata = {
        name: tool.name,
        description: tool.getTool().description,
        parameters: (tool as unknown as { schema: unknown }).schema,
      };
      Reflect.defineMetadata(MCP_TOOL_METADATA_KEY, metadata, methodRef);
      (
        this.registry as unknown as {
          addDiscoveryTool: (
            moduleId: string,
            method: unknown,
            provider: unknown,
            name: string,
          ) => void;
        }
      ).addDiscoveryTool(this.mcpModuleId, methodRef, LinkedApiToolsProvider, methodName);
    }
  }
}

function determineTransport(rawReq?: { url?: string }): string {
  if (!rawReq) return 'stdio';
  const url = rawReq.url ?? '';
  return url.includes('/messages') ? 'sse' : 'http';
}
