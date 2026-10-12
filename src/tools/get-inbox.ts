import LinkedApi, {
  TInboxPersonPollResult,
  TInboxPollRequest,
  TInboxPollResult,
  TMappedResponse,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

type TGetInboxArgs = TInboxPollRequest & { personUrl?: string };

export class GetInboxTool extends LinkedApiTool<
  TGetInboxArgs,
  TInboxPollResult | TInboxPersonPollResult
> {
  public readonly name = 'get_inbox';
  protected readonly schema = z.object({
    since: z.string().optional(),
    type: z.enum(['st', 'nv']).optional(),
    threadId: z.string().optional(),
    personUrl: z.string().optional(),
  });

  public override async execute({
    linkedapi,
    args: { since, type, threadId, personUrl },
  }: {
    linkedapi: LinkedApi;
    args: TGetInboxArgs;
  }): Promise<TMappedResponse<TInboxPollResult | TInboxPersonPollResult>> {
    return linkedapi.pollInbox({
      since,
      type,
      threadId,
      personUrl,
    });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        "Default way to read LinkedIn messages (standard and Sales Navigator), newest first. Without personUrl returns new messages across all conversations since inbox monitoring was enabled; requires sync_inbox (or nv_sync_inbox) once per account. With personUrl returns the whole known conversation with that person, including history loaded by sync_conversation, as { messages, threads }: each message also carries inboxMessageId (its id in the result without personUrl, or null) and threadId may be null; each thread carries historyFrom and historyComplete. Check threads[].historyComplete – if false and you need earlier messages, call sync_conversation once, then call get_inbox again. Every message carries personUrn — the permanent LinkedIn member URN (urn:li:member:<id>) of the person on the other side of the thread, or null when LinkedIn does not expose it. personHashedUrl is LinkedIn's hashed profile URL and is always present; personPublicUrl is the public vanity URL when that person has been resolved, otherwise null.",
      inputSchema: {
        type: 'object',
        properties: {
          since: {
            type: 'string',
            description:
              "Optional ISO 8601 timestamp to only retrieve messages at or after this date (e.g., '2024-01-15T10:30:00Z'). If not provided, all captured messages are returned. Message times are whole minutes.",
          },
          type: {
            type: 'string',
            enum: ['st', 'nv'],
            description:
              'Optional inbox type filter: "st" for standard messages, "nv" for Sales Navigator messages. If omitted, both are returned.',
          },
          threadId: {
            type: 'string',
            description:
              'Optional conversation thread identifier to restrict the result to a single thread.',
          },
          personUrl: {
            type: 'string',
            description:
              "Optional LinkedIn URL of one person to get the whole known conversation with them instead of the whole inbox (e.g., 'https://www.linkedin.com/in/john-doe'). A hashed URL (personHashedUrl from a message) always matches; a public URL matches only once Linked API knows that person's public URL, so prefer personHashedUrl when messages from this person show personPublicUrl: null.",
          },
        },
        required: [],
      },
    };
  }
}
