import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { fetchPostSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TFetchPostParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getFetchPostTool = (): Tool => ({
  name: "fetch_post",
  description:
    "This action allows you to open a post to retrieve its data. (st.openPost action).",
  inputSchema: {
    type: "object",
    properties: {
      postUrl: {
        type: "string",
        description:
          "LinkedIn URL of the post. (e.g., 'https://www.linkedin.com/posts/username_activity-id')",
      },
    },
    required: ["postUrl"],
  },
});

const fetchPost = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = fetchPostSchema.parse(args);
  const progressToken = "fetch_post";
  const workflow = await linkedapi.fetchPost(params as TFetchPostParams);
  const result = await executeWithProgress(
    progressToken,
    progressCallback,
    workflow,
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

export const fetchPostTool: ToolHandler = {
  tool: getFetchPostTool(),
  handler: fetchPost,
};
