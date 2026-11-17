import LinkedApi, {
  SIGNAL_EVENT_TYPE,
  SIGNAL_TYPE,
  TMappedResponse,
  TSignalPollRequest,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import type { TSignalEventsPage } from '../types/signal-events-page.type.js';
import { LinkedApiTool } from '../utils/linked-api-tool.js';
import { pageSignalEvents } from '../utils/page-signal-events.js';

// Without since the poll returns up to 90 days of events, tens of megabytes on a busy account, and
// every next page would download the whole newer backlog again.
const DEFAULT_LOOKBACK_MS = 24 * 60 * 60 * 1000;

export class GetSignalEventsTool extends LinkedApiTool<TSignalPollRequest, TSignalEventsPage> {
  public readonly name = 'get_signal_events';
  // Usually called with no arguments at all, which some clients send as an absent object.
  protected readonly schema = z
    .object({
      since: z.string().optional(),
      signalId: z.string().min(1).optional(),
      signalType: z.enum(Object.values(SIGNAL_TYPE)).optional(),
      eventType: z.enum(Object.values(SIGNAL_EVENT_TYPE)).optional(),
    })
    .default({});

  public override async execute({
    linkedapi,
    args: { since, signalId, signalType, eventType },
  }: {
    linkedapi: LinkedApi;
    args: TSignalPollRequest;
  }): Promise<TMappedResponse<TSignalEventsPage>> {
    const pageSince = since ?? new Date(Date.now() - DEFAULT_LOOKBACK_MS).toISOString();
    const { data, errors } = await linkedapi.pollSignals({
      since: pageSince,
      signalId,
      signalType,
      eventType,
    });

    return {
      data:
        data &&
        pageSignalEvents({
          since: pageSince,
          events: data.events,
        }),
      errors,
    };
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Read what signals detected (created with create_signal): new posts, comments, reactions, profile views and connection changes, one page at a time. Always pass since – the nextSince of your previous call – to read only what is new. Without since the tool reads the last 24 hours; pass an older since only when you need older events (they are kept 90 days). Returns { since, events, hasMore, nextSince }: since is the moment the page starts after; the page holds the earliest events recorded after it, listed newest first; nextSince is the newest detectedAt in the page. When hasMore is true, call again with since = nextSince for the next page – nothing is skipped or repeated. On a busy account narrow the read with signalId, signalType or eventType. Process each event once by its id. Every event carries signalId, signalType, label, type and detectedAt (when the check recorded it, not when it happened on LinkedIn), plus its subject: post (postPublished, postFound), postUrl and comment (commentAdded), postUrl and reaction (reactionAdded), viewer (profileViewed), or personUrn and personUrl (connectionAccepted, connectionAdded, connectionRequestReceived).',
      inputSchema: {
        type: 'object',
        properties: {
          since: {
            type: 'string',
            description:
              "ISO 8601 timestamp: return events recorded after it (e.g., '2026-10-12T16:40:00.000Z'). Pass the nextSince of your previous call. Defaults to 24 hours ago.",
          },
          signalId: {
            type: 'string',
            minLength: 1,
            description: 'Optional. Only events of this signal.',
          },
          signalType: {
            type: 'string',
            enum: Object.values(SIGNAL_TYPE),
            description: 'Optional. Only events of signals of this type.',
          },
          eventType: {
            type: 'string',
            enum: Object.values(SIGNAL_EVENT_TYPE),
            description: 'Optional. Only events of this type.',
          },
        },
        required: [],
      },
    };
  }
}
