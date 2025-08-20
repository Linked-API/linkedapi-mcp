import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolResult,
  ProgressNotification,
  ToolHandler,
} from "../../types/index.js";
import { nvFetchPersonSchema } from "../../linked-api-schemas.js";
import LinkedApi, { TNvOpenPersonPageParams } from "linkedapi-node";
import { executeWithProgress } from "../../utils/execute-with-progress.js";

const getNvFetchPersonTool = (): Tool => ({
  name: "nv_fetch_person",
  description:
    "Allows you to open a person page in Sales Navigator to retrieve their basic information (nv.openPersonPage action).",
  inputSchema: {
    type: "object",
    properties: {
      personHashedUrl: {
        type: "string",
        description: "Hashed LinkedIn URL of the person.",
      },
    },
    required: ["personHashedUrl"],
  },
});

const salesNavigatorFetchPerson = async (
  linkedapi: LinkedApi,
  args: unknown,
  progressCallback?: (p: ProgressNotification) => void,
): Promise<CallToolResult> => {
  const params = nvFetchPersonSchema.parse(args);
  const progressToken = "nv_fetch_person";
  const workflow = await linkedapi.salesNavigatorFetchPerson(
    params as TNvOpenPersonPageParams,
  );
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

export const nvFetchPersonTool: ToolHandler = {
  tool: getNvFetchPersonTool(),
  handler: salesNavigatorFetchPerson,
};
