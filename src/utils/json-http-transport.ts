import { Transport, TransportSendOptions } from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  isJSONRPCError,
  isJSONRPCNotification,
  isJSONRPCRequest,
  isJSONRPCResponse,
  JSONRPCMessage,
  JSONRPCMessageSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createHash } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';

import { logger } from './logger';

type TRequestId = number | string;

interface TPendingRequest {
  originalId: TRequestId;
  clientKey: string;
  connId?: string;
}

interface TConnectionContext {
  res: ServerResponse;
  internalIds: Array<number>;
  responses: Map<number, JSONRPCMessage>;
}

interface TSseContext {
  res: ServerResponse;
  keepalive: NodeJS.Timeout;
}

const ANONYMOUS_CLIENT_KEY = 'anonymous' as const;
const SSE_KEEPALIVE_INTERVAL_MS = 25000 as const;

export class JsonHTTPServerTransport implements Transport {
  public onclose?: () => void;
  public onerror?: (error: Error) => void;
  public onmessage?: (
    message: JSONRPCMessage,
    extra?: {
      requestInfo?: {
        headers: IncomingMessage['headers'];
        method?: string;
        transport?: 'http' | 'sse';
      };
      authInfo?: unknown;
    },
  ) => void;

  private started = false;
  private nextInternalId = 1;
  private nextConnectionId = 1;
  private pendingRequests = new Map<number, TPendingRequest>();
  private clientRequestIndex = new Map<string, number>();
  private connections = new Map<string, TConnectionContext>();
  private sseStreams = new Map<string, TSseContext>();

  async start(): Promise<void> {
    if (this.started) throw new Error('Transport already started');
    this.started = true;
  }

  async close(): Promise<void> {
    this.sseStreams.forEach((stream) => {
      try {
        clearInterval(stream.keepalive);
        if (!stream.res.writableEnded) {
          stream.res.end();
        }
      } catch {
        // ignore
      }
      logger.info('SSE connection terminated during transport close');
    });
    this.sseStreams.clear();
    this.connections.forEach((ctx) => {
      try {
        if (!ctx.res.writableEnded) {
          ctx.res.end();
        }
      } catch {
        // ignore
      }
    });
    this.connections.clear();
    this.pendingRequests.clear();
    this.clientRequestIndex.clear();
    this.onclose?.();
  }

  async send(message: JSONRPCMessage, options?: TransportSendOptions): Promise<void> {
    if (isJSONRPCResponse(message) || isJSONRPCError(message)) {
      this.deliverResponse(message);
      return;
    }

    const relatedRequestId = options?.relatedRequestId;
    if (relatedRequestId === undefined) return;

    const pending = this.pendingRequests.get(relatedRequestId as number);
    if (!pending) return;

    this.writeToSse(pending.clientKey, message);
  }

  // Handle HTTP requests: supports POST for JSON and GET for SSE
  async handleRequest(
    req: IncomingMessage & { auth?: unknown },
    res: ServerResponse,
    parsedBody?: unknown,
  ): Promise<void> {
    try {
      const clientKey = resolveClientKey(req.headers);

      // SSE endpoint: accept GET with text/event-stream
      const acceptHeader = (req.headers['accept'] || '').toString();
      if (req.method === 'GET' && acceptHeader.includes('text/event-stream')) {
        this.openSseStream(clientKey, res, req.headers);
        return;
      }

      if (req.method !== 'POST') {
        res.writeHead(405, { Allow: 'POST' }).end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Method not allowed. Only POST is supported.',
            },
            id: null,
          }),
        );
        logger.warn(
          {
            method: req.method,
            headers: req.headers,
          },
          'Rejected non-POST HTTP request',
        );
        return;
      }

      // For POST, allow generic Accepts; when SSE is connected, we don't require JSON accept
      const accept = req.headers['accept'];
      const acceptsJson = !!(accept && accept.includes('application/json'));
      const sseStream = this.sseStreams.get(clientKey);
      const sseActive = !!sseStream && !sseStream.res.writableEnded;
      if (!acceptsJson && !sseActive) {
        res.writeHead(406);
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Not Acceptable: Client must accept application/json or have SSE open',
            },
            id: null,
          }),
        );
        logger.warn(
          {
            headers: req.headers,
          },
          'Rejected POST due to unacceptable Accept header',
        );
        return;
      }

      const ct = req.headers['content-type'];
      if (!(ct && ct.includes('application/json'))) {
        res.writeHead(415);
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Unsupported Media Type: Content-Type must be application/json',
            },
            id: null,
          }),
        );
        logger.warn(
          {
            headers: req.headers,
          },
          'Rejected POST due to unsupported Content-Type',
        );
        return;
      }

      let raw: unknown = parsedBody;
      if (raw === undefined) {
        const chunks: Array<Buffer> = [];
        await new Promise<void>((resolve, reject) => {
          req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
          req.on('end', () => resolve());
          req.on('error', reject);
        });
        raw = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
      }

      const messages = Array.isArray(raw)
        ? (raw as Array<unknown>).map((m) => JSONRPCMessageSchema.parse(m))
        : [JSONRPCMessageSchema.parse(raw)];

      const hasRequests = messages.some(isJSONRPCRequest);
      if (!hasRequests) {
        res.writeHead(202).end();
        this.dispatch(this.registerMessages(messages, clientKey).dispatched, req, 'http');
        logger.info('Accepted POST without requests (notifications only)');
        return;
      }

      // With SSE, we emit responses on the SSE stream; reply 202 to POST immediately
      if (sseActive && !acceptsJson) {
        res.writeHead(202).end();
        this.dispatch(this.registerMessages(messages, clientKey).dispatched, req, 'sse');
        logger.info('POST handled with SSE active: responded 202 and streaming via SSE');
        return;
      }

      const requestIds = messages.filter(isJSONRPCRequest).map((message) => message.id);
      const connId = `conn-${this.nextConnectionId++}`;
      const { dispatched, internalIds } = this.registerMessages(messages, clientKey, connId);
      this.connections.set(connId, {
        res,
        internalIds,
        responses: new Map(),
      });

      res.on('close', () => this.dropConnection(connId));

      this.dispatch(dispatched, req, 'http');
      logger.info(
        {
          connId,
          requestIds,
        },
        'POST handled with JSON response mode',
      );
    } catch (error) {
      this.onerror?.(error as Error);
      res.writeHead(400);
      res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: 'Parse error',
            data: String(error),
          },
          id: null,
        }),
      );
      logger.error(error as Error, 'HTTP request handling parse/validation error');
    }
  }

  private dispatch(
    messages: Array<JSONRPCMessage>,
    req: IncomingMessage & { auth?: unknown },
    transport: 'http' | 'sse',
  ): void {
    for (const message of messages) {
      this.onmessage?.(message, {
        requestInfo: {
          headers: req.headers,
          method: req.method,
          transport,
        },
        authInfo: req.auth,
      });
    }
  }

  // JSON-RPC ids are only unique within one client session, and this transport is shared by every
  // connected client, so incoming ids are swapped for process-unique ones before they reach the MCP
  // server. Without this, concurrent sessions overwrite each other's routing entries and a response
  // can be written to another client's connection.
  private registerMessages(
    messages: Array<JSONRPCMessage>,
    clientKey: string,
    connId?: string,
  ): { dispatched: Array<JSONRPCMessage>; internalIds: Array<number> } {
    const dispatched: Array<JSONRPCMessage> = [];
    const internalIds: Array<number> = [];

    for (const message of messages) {
      if (!isJSONRPCRequest(message)) {
        dispatched.push(this.translateCancellation(message, clientKey));
        continue;
      }

      const internalId = this.nextInternalId++;
      internalIds.push(internalId);
      this.pendingRequests.set(internalId, {
        originalId: message.id,
        clientKey,
        connId,
      });
      this.clientRequestIndex.set(buildIndexKey(clientKey, message.id), internalId);
      dispatched.push({
        ...message,
        id: internalId,
      });
    }

    return {
      dispatched,
      internalIds,
    };
  }

  private translateCancellation(message: JSONRPCMessage, clientKey: string): JSONRPCMessage {
    if (!isJSONRPCNotification(message) || message.method !== 'notifications/cancelled') {
      return message;
    }
    const params = message.params as { requestId?: TRequestId } | undefined;
    if (params?.requestId === undefined) return message;

    const internalId = this.clientRequestIndex.get(buildIndexKey(clientKey, params.requestId));
    if (internalId === undefined) return message;

    return {
      ...message,
      params: {
        ...params,
        requestId: internalId,
      },
    };
  }

  private deliverResponse(message: JSONRPCMessage): void {
    const internalId = (message as { id?: TRequestId }).id;
    if (typeof internalId !== 'number') {
      logger.warn('Dropped response without a routable id');
      return;
    }
    const pending = this.pendingRequests.get(internalId);
    if (!pending) {
      logger.warn({ internalId }, 'Dropped response without a pending request');
      return;
    }
    this.forgetRequest(internalId, pending);

    const restored = {
      ...message,
      id: pending.originalId,
    };

    if (!pending.connId) {
      this.writeToSse(pending.clientKey, restored);
      return;
    }

    const ctx = this.connections.get(pending.connId);
    if (!ctx) {
      logger.warn({ connId: pending.connId }, 'Dropped response for a closed HTTP connection');
      return;
    }

    ctx.responses.set(internalId, restored);
    if (!ctx.internalIds.every((id) => ctx.responses.has(id))) return;

    const body =
      ctx.internalIds.length === 1
        ? ctx.responses.get(ctx.internalIds[0]!)
        : ctx.internalIds.map((id) => ctx.responses.get(id));

    this.connections.delete(pending.connId);
    ctx.res.writeHead(200, { 'Content-Type': 'application/json' });
    ctx.res.end(JSON.stringify(body));
  }

  private openSseStream(
    clientKey: string,
    res: ServerResponse,
    headers: IncomingMessage['headers'],
  ): void {
    const previous = this.sseStreams.get(clientKey);
    if (previous) {
      try {
        clearInterval(previous.keepalive);
        if (!previous.res.writableEnded) previous.res.end();
      } catch {
        // ignore
      }
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write(': connected\n\n');

    const keepalive = setInterval(() => {
      if (res.writableEnded) return;
      res.write('event: ping\ndata: {}\n\n');
    }, SSE_KEEPALIVE_INTERVAL_MS);

    const stream: TSseContext = {
      res,
      keepalive,
    };
    this.sseStreams.set(clientKey, stream);
    logger.info(
      {
        headers,
      },
      'SSE connection established',
    );

    res.on('close', () => {
      clearInterval(keepalive);
      if (this.sseStreams.get(clientKey) === stream) {
        this.sseStreams.delete(clientKey);
      }
      logger.info('SSE connection closed by client');
    });
  }

  private writeToSse(clientKey: string, message: JSONRPCMessage): void {
    const stream = this.sseStreams.get(clientKey);
    if (!stream || stream.res.writableEnded) return;
    stream.res.write(`data: ${JSON.stringify(message)}\n\n`);
  }

  private dropConnection(connId: string): void {
    const ctx = this.connections.get(connId);
    if (!ctx) return;

    this.connections.delete(connId);
    for (const internalId of ctx.internalIds) {
      const pending = this.pendingRequests.get(internalId);
      if (pending) this.forgetRequest(internalId, pending);
    }
  }

  private forgetRequest(internalId: number, pending: TPendingRequest): void {
    this.pendingRequests.delete(internalId);
    const indexKey = buildIndexKey(pending.clientKey, pending.originalId);
    if (this.clientRequestIndex.get(indexKey) === internalId) {
      this.clientRequestIndex.delete(indexKey);
    }
  }
}

function buildIndexKey(clientKey: string, originalId: TRequestId): string {
  return `${clientKey}::${String(originalId)}`;
}

function readHeader(headers: IncomingMessage['headers'], name: string): string | undefined {
  const value = headers[name];
  if (Array.isArray(value)) {
    return value.find((item) => item.trim().length > 0)?.trim();
  }
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

// SSE responses can only be routed to a stream owned by the same tenant, and the API token is the
// only client identity this transport sees. It is hashed so it never reaches logs or memory dumps
// as a usable credential.
function resolveClientKey(headers: IncomingMessage['headers']): string {
  const token =
    readHeader(headers, 'linked-api-token') ?? readHeader(headers, 'identification-token');
  if (!token) return ANONYMOUS_CLIENT_KEY;

  return createHash('sha256').update(token).digest('hex').slice(0, 32);
}
