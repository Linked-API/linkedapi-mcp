import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TConversationPollRequest } from 'linkedapi-node';

import { pollConversationsSchema } from '../../linked-api-schemas.js';
import { CallToolResult, ToolHandler } from '../../types/index.js';

const getPollConversationsTool = (): Tool => ({
  name: 'poll_conversations',
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
});

const pollConversations = async (linkedapi: LinkedApi, args: unknown): Promise<CallToolResult> => {
  const { conversations } = pollConversationsSchema.parse(args);
  const result = await linkedapi.pollConversations(conversations as TConversationPollRequest[]);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const pollConversationsTool: ToolHandler = {
  tool: getPollConversationsTool(),
  handler: pollConversations,
};
