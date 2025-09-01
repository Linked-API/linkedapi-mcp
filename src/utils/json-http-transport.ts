import { Transport, TransportSendOptions } from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  isJSONRPCError,
  isJSONRPCRequest,
  isJSONRPCResponse,
  JSONRPCMessage,
  JSONRPCMessageSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { IncomingMessage, ServerResponse } from 'node:http';

type RequestId = number | string;

type ConnectionContext = {
  res: ServerResponse;
  orderedIds: RequestId[];
  pendingIds: Set<RequestId>;
  responses: Map<RequestId, JSONRPCMessage>;
};

export class JsonHTTPServerTransport implements Transport {
  public onclose?: () => void;
  public onerror?: (error: Error) => void;
  public onmessage?: (
    message: JSONRPCMessage,
    extra?: { requestInfo?: { headers: IncomingMessage['headers'] }; authInfo?: unknown },
  ) => void;

  private started = false;
  private requestIdToConn = new Map<RequestId, string>();
  private connections = new Map<string, ConnectionContext>();

  async start(): Promise<void> {
    if (this.started) throw new Error('Transport already started');
    this.started = true;
  }

  async close(): Promise<void> {
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
    this.requestIdToConn.clear();
    this.onclose?.();
  }

  async send(message: JSONRPCMessage, options?: TransportSendOptions): Promise<void> {
    let relatedId = options?.relatedRequestId;
    if (isJSONRPCResponse(message) || isJSONRPCError(message)) {
      relatedId = message.id;
    }
    if (relatedId === undefined) {
      // No place to send notifications/responses without a related request in JSON-only mode
      return;
    }
    const connId = this.requestIdToConn.get(relatedId);
    if (!connId) throw new Error(`No HTTP connection for request ${String(relatedId)}`);
    const ctx = this.connections.get(connId);
    if (!ctx) throw new Error(`HTTP connection closed for request ${String(relatedId)}`);

    ctx.responses.set(relatedId, message);
    // When all responses for this HTTP request are ready, flush JSON and end
    const allReady = ctx.orderedIds.every((id) => ctx.responses.has(id));
    if (!allReady) return;

    const body =
      ctx.orderedIds.length === 1
        ? ctx.responses.get(ctx.orderedIds[0]!)
        : ctx.orderedIds.map((id) => ctx.responses.get(id));

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    ctx.res.writeHead(200, headers);
    ctx.res.end(JSON.stringify(body));

    // Cleanup
    this.connections.delete(connId);
    ctx.orderedIds.forEach((id) => this.requestIdToConn.delete(id));
  }

  // Handle only POST requests; no SSE/GET support
  async handleRequest(
    req: IncomingMessage & { auth?: unknown },
    res: ServerResponse,
    parsedBody?: unknown,
  ): Promise<void> {
    try {
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
        return;
      }

      const accept = req.headers['accept'];
      if (!(accept && accept.includes('application/json'))) {
        res.writeHead(406);
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Not Acceptable: Client must accept application/json',
            },
            id: null,
          }),
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
        return;
      }

      let raw: unknown = parsedBody;
      if (raw === undefined) {
        const chunks: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
          req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
          req.on('end', () => resolve());
          req.on('error', reject);
        });
        raw = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
      }

      const messages = Array.isArray(raw)
        ? (raw as unknown[]).map((m) => JSONRPCMessageSchema.parse(m))
        : [JSONRPCMessageSchema.parse(raw)];

      const hasRequests = messages.some(isJSONRPCRequest);
      if (!hasRequests) {
        res.writeHead(202).end();
        for (const msg of messages) {
          this.onmessage?.(msg, {
            requestInfo: {
              headers: req.headers,
            },
            authInfo: req.auth,
          });
        }
        return;
      }

      const orderedIds: RequestId[] = messages.filter(isJSONRPCRequest).map((m) => m.id);
      const connId = `${Date.now()}-${Math.random()}`;
      this.connections.set(connId, {
        res,
        orderedIds,
        pendingIds: new Set(orderedIds),
        responses: new Map(),
      });
      orderedIds.forEach((id) => this.requestIdToConn.set(id, connId));

      res.on('close', () => {
        this.connections.delete(connId);
        orderedIds.forEach((id) => this.requestIdToConn.delete(id));
      });

      for (const msg of messages) {
        this.onmessage?.(msg, {
          requestInfo: {
            headers: req.headers,
          },
          authInfo: req.auth,
        });
      }
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
    }
  }
}
