import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { retrieveConnectionsSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TRetrieveConnectionsParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getRetrieveConnectionsTool = (): Tool => ({
  name: "retrieve_connections",
  description:
    "allows you to retrieve your connections and perform additional person-related actions if needed (st.retrieveConnections action).",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description:
          "Optional. Number of connections to return. Defaults to 500, with a maximum value of 1000.",
      },
      filter: {
        type: "object",
        description:
          "Optional. Object that specifies filtering criteria for people. When multiple filter fields are specified, they are combined using AND logic.",
        properties: {
          firstName: {
            type: "string",
            description: "Optional. First name of person.",
          },
          lastName: {
            type: "string",
            description: "Optional. Last name of person.",
          },
          position: {
            type: "string",
            description: "Optional. Job position of person.",
          },
          locations: {
            type: "array",
            description:
              "Optional. Array of free-form strings representing locations. Matches if person is located in any of the listed locations.",
          },
          industries: {
            type: "array",
            description:
              "Optional. Array of enums representing industries. Matches if person works in any of the listed industries. Takes specific values available in the LinkedIn interface.",
          },
          currentCompanies: {
            type: "array",
            description:
              "Optional. Array of company names. Matches if person currently works at any of the listed companies.",
          },
          previousCompanies: {
            type: "array",
            description:
              "Optional. Array of company names. Matches if person previously worked at any of the listed companies.",
          },
          schools: {
            type: "array",
            description:
              "Optional. Array of institution names. Matches if person currently attends or previously attended any of the listed institutions.",
          },
        },
      },
    },
  },
});

const retrieveConnections = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (progress: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = retrieveConnectionsSchema.parse(args);
  const progressToken = "retrieve_connections";
  const workflow = await linkedapi.retrieveConnections({
    limit: params.limit,
    filter: params.filter,
  } as TRetrieveConnectionsParams);
  const result = await executeWithProgress(
    progressToken,
    progressCallback,
    workflow,
  );
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};

export const retrieveConnectionsTool: ToolHandler = {
  tool: getRetrieveConnectionsTool(),
  handler: retrieveConnections,
};
