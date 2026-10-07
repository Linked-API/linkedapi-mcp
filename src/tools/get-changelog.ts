import { getChangelog, TChangelogResponse } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { PublicTool } from '../utils/public-tool.js';

interface TGetChangelogToolParams {
  since?: string;
}

export class GetChangelogTool extends PublicTool<TGetChangelogToolParams, TChangelogResponse> {
  public readonly name = 'get_changelog';
  // Usually called with no arguments at all, which some clients send as an absent object.
  protected readonly schema = z
    .object({
      since: z.string().optional(),
    })
    .default({});

  public override async execute({
    args,
  }: {
    args: TGetChangelogToolParams;
  }): Promise<TChangelogResponse> {
    return await getChangelog({ since: args.since });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Read the public Linked API changelog: what was released and when, newest first. Use it when the user asks what is new or recently changed in Linked API, or whether Linked API supports something yet — a capability may have shipped recently, so check here before saying it does not exist. Each release has a date and items with a title, a body and docs, a path on https://linkedapi.io (prefix it to link the user to the documentation). Needs no Linked API tokens and does not start a LinkedIn workflow. The same changelog is published at https://linkedapi.io/changelog.',
      inputSchema: {
        type: 'object',
        properties: {
          since: {
            type: 'string',
            description:
              "Only return releases for the week containing this point and later: an ISO 8601 date (e.g. '2026-10-01') or an instant with a time zone (e.g. '2026-10-01T00:00:00Z'). A release covers a week and is dated by its first day, so one dated a few days before since can still be included. Omit to get the whole changelog.",
          },
        },
      },
    };
  }
}
