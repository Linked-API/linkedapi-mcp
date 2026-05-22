import LinkedApi, {
  OPERATION_NAME,
  TConversationPollResult,
  TMappedResponse,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import type { TWorkflowAck } from '../types/linked-api-tool-result.type.js';
import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class GetConversationTool extends LinkedApiTool<
  { personUrl: string; since?: string },
  TConversationPollResult
> {
  public readonly name = 'get_conversation';
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
  }): Promise<TMappedResponse<TConversationPollResult> | TWorkflowAck> {
    const conversations = await this.pollConversation(linkedapi, personUrl, since);
    if (conversations.errors.length === 0) {
      return conversations;
    }
    const ack = await linkedapi.syncConversation.execute({ personUrl });
    return { ...ack,
operationName: OPERATION_NAME.syncConversation };
  }

  private async pollConversation(
    linkedapi: LinkedApi,
    personUrl: string,
    since?: string,
  ): Promise<TMappedResponse<TConversationPollResult>> {
    const conversations = await linkedapi.pollConversations([
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
        'Retrieve a conversation with a LinkedIn person via standard LinkedIn messaging. Returns the conversation immediately if it has already been synced. If the conversation has not been synced yet, this tool starts a syncConversation workflow and returns its ack ({status, workflowId, operationName: "syncConversation", message}); the client should call get_workflow_result with that workflowId until completion, then call get_conversation again to read the synced messages.',
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
