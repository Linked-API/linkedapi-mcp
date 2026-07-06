import LinkedApi, { TInboxPollRequest, TInboxPollResult, TMappedResponse } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class GetInboxTool extends LinkedApiTool<TInboxPollRequest, TInboxPollResult> {
  public readonly name = 'get_inbox';
  protected readonly schema = z.object({
    since: z.string().optional(),
    type: z.enum(['st', 'nv']).optional(),
    threadId: z.string().optional(),
  });

  public override async execute({
    linkedapi,
    args: { since, type, threadId },
  }: {
    linkedapi: LinkedApi;
    args: TInboxPollRequest;
  }): Promise<TMappedResponse<TInboxPollResult>> {
    return linkedapi.pollInbox({
      since,
      type,
      threadId,
    });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Get messages from the monitored inbox across all conversations (standard and Sales Navigator), newest first. Requires inbox monitoring to be enabled once with sync_inbox (or nv_sync_inbox for Sales Navigator).',
      inputSchema: {
        type: 'object',
        properties: {
          since: {
            type: 'string',
            description:
              "Optional ISO 8601 timestamp to only retrieve messages after this date (e.g., '2024-01-15T10:30:00Z'). If not provided, all captured messages are returned.",
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
        },
        required: [],
      },
    };
  }
}
