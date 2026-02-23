import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TConversationPollResult, TMappedResponse } from '@linkedapi/node';
import z from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class NvGetConversationTool extends LinkedApiTool<
  { personUrl: string; since?: string },
  TConversationPollResult
> {
  public readonly name = 'nv_get_conversation';
  protected readonly schema = z.object({
    personUrl: z.string(),
    since: z.string().optional(),
  });

  public override async execute({
    linkedapi,
    args: { personUrl, since },
  }: {
    linkedapi: LinkedApi;
    args: { personUrl: string; since?: string };
    workflowTimeout: number;
    progressToken?: string | number;
  }): Promise<TMappedResponse<TConversationPollResult>> {
    const conversations = await this.getConversation(linkedapi, personUrl, since);
    if (conversations.errors.length === 0) {
      return conversations;
    }
    const workflowId = await linkedapi.nvSyncConversation.execute({ personUrl });
    await linkedapi.nvSyncConversation.result(workflowId);
    return await this.getConversation(linkedapi, personUrl, since);
  }

  private async getConversation(
    linkedapi: LinkedApi,
    personUrl: string,
    since?: string,
  ): Promise<TMappedResponse<TConversationPollResult>> {
    const conversations = await linkedapi.pollConversations([
      {
        personUrl: personUrl,
        type: 'nv',
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
        'Allows you to get a conversation with a LinkedIn person using Sales Navigator messaging.',
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
