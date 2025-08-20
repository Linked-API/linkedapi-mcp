import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { commentOnPostSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TCommentOnPostParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getCommentOnPostTool = (): Tool => ({
  name: "comment_on_post",
  description:
    "Allows you to leave a comment on a post (st.commentOnPost action).",
  inputSchema: {
    type: "object",
    properties: {
      postUrl: {
        type: "string",
        description:
          "The LinkedIn post URL to comment on (e.g., 'https://www.linkedin.com/posts/username_activity-id')",
      },
      text: {
        type: "string",
        description: "Comment text, must be up to 1000 characters.",
      },
    },
    required: ["postUrl", "text"],
  },
});

const commentOnPost = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = commentOnPostSchema.parse(args);
  const progressToken = "comment_on_post";
  const workflow = await linkedapi.commentOnPost(
    params as TCommentOnPostParams,
  );
  await executeWithProgress(progressToken, progressCallback, workflow);
  return {
    content: [
      {
        type: "text",
        text: "Comment posted",
      },
    ],
  };
};

export const commentOnPostTool: ToolHandler = {
  tool: getCommentOnPostTool(),
  handler: commentOnPost,
};
