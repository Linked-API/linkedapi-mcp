import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, {
  TConversationPollRequest,
  TConversationPollResult,
  TMappedResponse,
} from 'linkedapi-node';
import z from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { LinkedApiTool } from '../linked-api-tool.js';

export class PollConversationsTool extends LinkedApiTool<TConversationPollRequest[], unknown> {
  public readonly name = 'poll_conversations';
  protected readonly schema = z.object({
    conversations: z.array(
      z.object({
        personUrl: z.string(),
        type: z.enum(['st', 'nv']).default('st'),
        since: z.string().optional(),
      }),
    ),
  });

  private readonly linkedapi: LinkedApi;

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(progressCallback);
    this.linkedapi = linkedapi;
  }

  public override async execute(
    args: TConversationPollRequest[],
  ): Promise<TMappedResponse<TConversationPollResult[]>> {
    return await this.linkedapi.pollConversations(args);
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Execute multiple conversation sync workflows to monitor for new messages across standard LinkedIn and Sales Navigator conversations.',
      inputSchema: {
        type: 'object',
        properties: {
          conversations: {
            type: 'array',
            description: 'Array of conversations to monitor for new messages',
            items: {
              type: 'object',
              properties: {
                personUrl: {
                  type: 'string',
                  description:
                    "The LinkedIn URL of the person whose conversation you want to poll (e.g., 'https://www.linkedin.com/in/john-doe')",
                },
                type: {
                  type: 'string',
                  enum: ['st', 'nv'],
                  description:
                    "Conversation type: 'st' for standard LinkedIn messages, 'nv' for Sales Navigator messages",
                },
                since: {
                  type: 'string',
                  description:
                    "Optional ISO 8601 timestamp to only retrieve messages since this date (e.g., '2024-01-15T10:30:00Z'). If not provided, the entire conversation history will be returned.",
                },
              },
              required: ['personUrl', 'type'],
            },
          },
        },
      },
    };
  }
}
