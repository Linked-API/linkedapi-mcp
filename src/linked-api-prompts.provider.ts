import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MCP_PROMPT_METADATA_KEY, McpRegistryService } from '@rekog/mcp-nest';
import 'reflect-metadata';
import { z } from 'zod';

import { availablePrompts, getPromptContent } from './prompts';

@Injectable()
export class LinkedApiPromptsProvider implements OnModuleInit {
  constructor(
    private readonly registry: McpRegistryService,
    @Inject('MCP_MODULE_ID') private readonly mcpModuleId: string,
  ) {}

  onModuleInit(): void {
    for (const prompt of availablePrompts) {
      const methodName = `prompt_${prompt.name.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      Object.defineProperty(this, methodName, {
        value: async () => {
          const content = getPromptContent(prompt.name);
          return {
            description: `Linked API MCP: ${prompt.name.replace('_', ' ')}`,
            messages: [
              {
                role: 'user',
                content: { type: 'text' as const,
text: content },
              },
            ],
          };
        },
      });
      const methodRef = (this as Record<string, unknown>)[methodName] as (
        ...args: unknown[]
      ) => unknown;
      const metadata = {
        name: prompt.name,
        description: prompt.description,
        parameters: z.object({}),
      };
      Reflect.defineMetadata(MCP_PROMPT_METADATA_KEY, metadata, methodRef);
      (
        this.registry as unknown as {
          addDiscoveryPrompt: (
            moduleId: string,
            method: unknown,
            provider: unknown,
            name: string,
          ) => void;
        }
      ).addDiscoveryPrompt(this.mcpModuleId, methodRef, LinkedApiPromptsProvider, methodName);
    }
  }
}
