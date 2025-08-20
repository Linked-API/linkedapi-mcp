import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CallToolResult, ToolHandler } from "../../types/index.js";
import { getApiUsageStatsSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TApiUsageStatsParams } from "linkedapi-node";

const getGetApiUsageStatsTool = (): Tool => ({
  name: "get_api_usage_stats",
  description: "Retrieve Linked API usage statistics",
  inputSchema: {
    type: "object",
    properties: {
      start: {
        type: "string",
        description:
          "Start date for the statistics period in ISO 8601 format (e.g., '2024-01-01T00:00:00Z')",
      },
      end: {
        type: "string",
        description:
          "End date for the statistics period in ISO 8601 format (e.g., '2024-01-31T23:59:59Z')",
      },
    },
    required: ["start", "end"],
  },
});

const getApiUsageStats = async (
  linkedapi: LinkedApi,
  args: unknown,
): Promise<CallToolResult> => {
  const params = getApiUsageStatsSchema.parse(args);
  const result = await linkedapi.getApiUsageStats(
    params as TApiUsageStatsParams,
  );
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const getApiUsageStatsTool: ToolHandler = {
  tool: getGetApiUsageStatsTool(),
  handler: getApiUsageStats,
};
