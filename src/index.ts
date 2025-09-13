#!/usr/bin/env node
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { McpTransportType } from '@rekog/mcp-nest';
import 'reflect-metadata';

import { createAppModule } from './app.module';

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

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const useHttp = hasFlag('--http') || hasFlag('--transport=http');
  const transports = useHttp
    ? [McpTransportType.SSE, McpTransportType.STREAMABLE_HTTP]
    : [McpTransportType.STDIO];
  const AppModule = createAppModule(transports);
  if (useHttp) {
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.PORT ?? getArgValue('--port') ?? 3000);
    const host = process.env.HOST ?? getArgValue('--host') ?? '0.0.0.0';
    await app.listen(port, host);
    logger.log(`HTTP transports listening on port ${port}`);
  } else {
    await NestFactory.createApplicationContext(AppModule);
    logger.log('STDIO transport initialized');
  }
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error(error);
  process.exit(1);
});
