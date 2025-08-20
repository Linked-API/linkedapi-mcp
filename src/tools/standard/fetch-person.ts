import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { fetchPersonSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TFetchPersonParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getFetchPersonTool = (): Tool => ({
  name: "fetch_person",
  description: `Allows you to open a person page to retrieve their basic information and perform additional person-related actions if needed. (st.openPersonPage action). Allows additional optional retrieval of experience, education, skills, languages, posts, comments and reactions.
⚠️ **PERFORMANCE WARNING**: Only set additional retrieval flags to true if you specifically need that data. Each additional parameter significantly increases execution time:
💡 **Recommendation**: Start with basic info only. Only request additional data if the user explicitly asks for it or if it's essential for the current task.
`,

  inputSchema: {
    type: "object",
    properties: {
      personUrl: {
        type: "string",
        description:
          "The LinkedIn profile URL of the person to fetch (e.g., 'https://www.linkedin.com/in/john-doe')",
      },
      retrieveExperience: {
        type: "boolean",
        description:
          "Optional. Whether to retrieve the person's experience information. Default is false.",
      },
      retrieveEducation: {
        type: "boolean",
        description:
          "Optional. Whether to retrieve the person's education information. Default is false.",
      },
      retrieveSkills: {
        type: "boolean",
        description:
          "Optional. Whether to retrieve the person's skills information. Default is false.",
      },
      retrieveLanguages: {
        type: "boolean",
        description:
          "Optional. Whether to retrieve the person's languages information. Default is false.",
      },
      retrievePosts: {
        type: "boolean",
        description:
          "Optional. Whether to retrieve the person's posts information. Default is false.",
      },
      retrieveComments: {
        type: "boolean",
        description:
          "Optional. Whether to retrieve the person's comments information. Default is false.",
      },
      retrieveReactions: {
        type: "boolean",
        description:
          "Optional. Whether to retrieve the person's reactions information. Default is false.",
      },
      postsRetrievalConfig: {
        type: "object",
        description:
          "Optional. Configuration for retrieving posts. Available only if retrievePosts is true.",
        properties: {
          limit: {
            type: "number",
            description:
              "Optional. Number of posts to retrieve. Defaults to 20, with a maximum value of 20.",
          },
          since: {
            type: "string",
            description:
              "Optional. ISO 8601 timestamp to filter posts published after the specified time.",
          },
        },
      },
      commentRetrievalConfig: {
        type: "object",
        description:
          "Optional. Configuration for retrieving comments. Available only if retrieveComments is true.",
        properties: {
          limit: {
            type: "number",
            description:
              "Optional. Number of comments to retrieve. Defaults to 20, with a maximum value of 20.",
          },
          since: {
            type: "string",
            description:
              "Optional. ISO 8601 timestamp to filter comments made after the specified time.",
          },
        },
      },
      reactionRetrievalConfig: {
        type: "object",
        description:
          "Optional. Configuration for retrieving reactions. Available only if retrieveReactions is true.",
        properties: {
          limit: {
            type: "number",
            description:
              "Optional. Number of reactions to retrieve. Defaults to 20, with a maximum value of 20.",
          },
          since: {
            type: "string",
            description:
              "Optional. ISO 8601 timestamp to filter reactions made after the specified time.",
          },
        },
      },
    },
    required: ["personUrl"],
  },
});

const fetchPerson = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = fetchPersonSchema.parse(args);
  const progressToken = "fetch_person";
  const workflow = await linkedapi.fetchPerson(params as TFetchPersonParams);
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

export const fetchPersonTool: ToolHandler = {
  tool: getFetchPersonTool(),
  handler: fetchPerson,
};
