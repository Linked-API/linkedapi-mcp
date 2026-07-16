import LinkedApi, {
  TMappedResponse,
  TNetworkPollRequest,
  TNetworkPollResult,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class GetNetworkTool extends LinkedApiTool<TNetworkPollRequest, TNetworkPollResult> {
  public readonly name = 'get_network';
  protected readonly schema = z.object({
    since: z.string().optional(),
    type: z.enum(['connectionAccepted', 'connectionAdded', 'connectionRequestReceived']).optional(),
  });

  public override async execute({
    linkedapi,
    args: { since, type },
  }: {
    linkedapi: LinkedApi;
    args: TNetworkPollRequest;
  }): Promise<TMappedResponse<TNetworkPollResult>> {
    return linkedapi.pollNetwork({
      since,
      type,
    });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Get connection events from the monitored network, newest first. Requires network monitoring to be enabled once with sync_network. Event types: "connectionAccepted" (a connection request you sent was accepted), "connectionAdded" (a new connection appeared in your network), "connectionRequestReceived" (someone sent you a connection request).',
      inputSchema: {
        type: 'object',
        properties: {
          since: {
            type: 'string',
            description:
              "Optional ISO 8601 timestamp to only retrieve events after this date (e.g., '2024-01-15T10:30:00Z'). If not provided, all captured events are returned.",
          },
          type: {
            type: 'string',
            enum: ['connectionAccepted', 'connectionAdded', 'connectionRequestReceived'],
            description:
              'Optional event type filter: "connectionAccepted", "connectionAdded", or "connectionRequestReceived". If omitted, all event types are returned.',
          },
        },
        required: [],
      },
    };
  }
}
