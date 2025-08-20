import {
  Tool,
  CallToolRequest,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { LinkedApi } from "linkedapi-node";

export type { CallToolResult };

export interface ExtendedCallToolRequest extends CallToolRequest {
  params: CallToolRequest["params"] & {
    _meta?: {
      progressToken?: string | number;
    };
  };
}

export interface ProgressNotification {
  progressToken: string | number;
  progress: number;
  total?: number;
  message?: string;
}

export type ToolHandler = {
  tool: Tool;
  handler: (
    linkedapi: LinkedApi,
    args: unknown,
    progressCallback?: (progress: ProgressNotification) => void,
  ) => Promise<CallToolResult>;
};

export interface LinkedApiServerConfig {
  linkedApiToken?: string;
  identificationToken?: string;
}
