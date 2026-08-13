import { OPERATION_NAME, TProfileViewer, TRetrieveProfileViewersParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class RetrieveProfileViewersTool extends OperationTool<
  TRetrieveProfileViewersParams,
  Array<TProfileViewer>
> {
  public override readonly name = 'retrieve_profile_viewers';
  public override readonly operationName = OPERATION_NAME.retrieveProfileViewers;
  protected override readonly schema = z.object({
    limit: z.number().int().min(1).max(300).optional(),
    since: z.string().optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        "Retrieves the people who recently viewed the current account's LinkedIn profile (st.retrieveProfileViewers action). Each entry is either identified — carrying name, publicUrl and urn (a member URN urn:li:member:<id>, null when LinkedIn does not expose it) — or anonymous, carrying only the description line LinkedIn displayed and a searchUrl holding the criteria it disclosed; pass that searchUrl to search_people as customSearchUrl to look for the viewer. Viewers are ordered newest first, and viewedAt is an estimate derived from the relative age LinkedIn shows.",
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 300,
            description: 'Maximum number of viewers to retrieve (default 20).',
          },
          since: {
            type: 'string',
            description:
              'ISO 8601 timestamp. Only viewers seen at or after it are returned, and reading stops once older views are reached. Matched against the estimated viewedAt.',
          },
        },
      },
    };
  }
}
