import { Module } from '@nestjs/common';
import { McpModule, McpTransportType } from '@rekog/mcp-nest';

import { LinkedApiPromptsProvider } from './linked-api-prompts.provider';
import { LinkedApiMCPServer } from './linked-api-server';
import { LinkedApiToolsProvider } from './linked-api-tools.provider';
import { systemPrompt } from './prompts';

export function createAppModule(transport: McpTransportType | McpTransportType[]) {
  @Module({
    imports: [
      McpModule.forRoot({
        name: 'linkedapi-mcp',
        version: '1.0.0',
        instructions: systemPrompt,
        transport,
      }),
    ],
    providers: [LinkedApiMCPServer, LinkedApiToolsProvider, LinkedApiPromptsProvider],
  })
  class AppModule {}

  return AppModule;
}
