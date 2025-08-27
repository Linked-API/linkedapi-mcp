import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TConversationPollResult, TMappedResponse } from 'linkedapi-node';
import z from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';
import { LinkedApiProgressNotification } from '../utils/types.js';

export class GetConversationTool extends LinkedApiTool<
  { personUrl: string; since?: string },
  TConversationPollResult
> {
  public readonly name = 'get_conversation';
  protected readonly schema = z.object({
    personUrl: z.string(),
    since: z.string().optional(),
  });

  private readonly linkedapi: LinkedApi;

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(progressCallback);
    this.linkedapi = linkedapi;
  }

  public override async execute({
    personUrl,
    since,
  }: {
    personUrl: string;
    since?: string;
  }): Promise<TMappedResponse<TConversationPollResult>> {
    const conversations = await this.getConversation(personUrl, since);
    if (conversations.errors.length === 0) {
      return conversations;
    }
    const workflowId = await this.linkedapi.syncConversation.execute({ personUrl });
    await this.linkedapi.syncConversation.result(workflowId);
    return await this.getConversation(personUrl, since);
  }

  private async getConversation(
    personUrl: string,
    since?: string,
  ): Promise<TMappedResponse<TConversationPollResult>> {
    const conversations = await this.linkedapi.pollConversations([
      {
        personUrl: personUrl,
        type: 'st',
        since: since,
      },
    ]);
    return {
      data: conversations.data ? conversations.data[0] : undefined,
      errors: conversations.errors,
    };
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Allows you to get a conversation with a LinkedIn person using standard LinkedIn messaging.',
      inputSchema: {
        type: 'object',
        properties: {
          personUrl: {
            type: 'string',
            description:
              "The LinkedIn URL of the person whose conversation you want to poll (e.g., 'https://www.linkedin.com/in/john-doe')",
          },
          since: {
            type: 'string',
            description:
              "Optional ISO 8601 timestamp to only retrieve messages since this date (e.g., '2024-01-15T10:30:00Z'). If not provided, the entire conversation history will be returned.",
          },
        },
        required: ['personUrl'],
      },
    };
  }
}
