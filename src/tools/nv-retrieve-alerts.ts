import { OPERATION_NAME, TNvAlert, TNvRetrieveAlertsParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvRetrieveAlertsTool extends OperationTool<TNvRetrieveAlertsParams, Array<TNvAlert>> {
  public override readonly name = 'nv_retrieve_alerts' as const;
  public override readonly operationName = OPERATION_NAME.nvRetrieveAlerts;
  protected override readonly schema = z.object({
    limit: z.number().int().min(1).max(1000).optional(),
    sort: z.enum(['latest', 'relevance']).optional(),
    filter: z
      .object({
        category: z.enum(['lead', 'account']).optional(),
        types: z.array(z.string()).optional(),
        since: z.iso.datetime({ offset: true }).optional(),
        excludeSuggested: z.boolean().optional(),
      })
      .optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Retrieve Sales Navigator lead and account alerts (root-only nv.retrieveAlerts). Returns a workflow acknowledgement; use get_workflow_result with operationName nvRetrieveAlerts. Final data is an array of alerts: id (notification URN), type (open upstream machine code), publishedAt (ISO UTC), subject {type: lead/account, urn, name: string|null, url, saved: boolean|null}, headline, text, subline, url, relatedEntityUrn (all five nullable strings). Subject URLs can be passed to nv_fetch_person or nv_fetch_company. Filters are ANDed. Saved-search and shared-list system notifications are excluded.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 1000,
            default: 50,
            description: 'Maximum number of matching alerts to return.',
          },
          sort: {
            type: 'string',
            enum: ['latest', 'relevance'],
            default: 'latest',
            description: 'Sales Navigator ordering; latest is newest first.',
          },
          filter: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                enum: ['lead', 'account'],
                description: 'Omit to retrieve both lead and account alerts.',
              },
              types: {
                type: 'array',
                items: { type: 'string' },
                description: 'Exact upstream machine codes; an empty array means no restriction.',
              },
              since: {
                type: 'string',
                format: 'date-time',
                description: 'Inclusive ISO timestamp cutoff.',
              },
              excludeSuggested: {
                type: 'boolean',
                default: false,
                description:
                  'Return only subjects confirmed as saved; exclude unsaved and unknown saved states.',
              },
            },
          },
        },
      },
    };
  }
}
