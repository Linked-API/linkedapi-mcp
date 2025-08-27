import { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export type { CallToolResult };

export interface ExtendedCallToolRequest extends CallToolRequest {
  params: CallToolRequest['params'] & {
    _meta?: {
      progressToken?: string | number;
    };
  };
}
export interface LinkedApiProgressNotification {
  progressToken?: string | number;
  progress: number;
  total?: number;
  message?: string;
}
