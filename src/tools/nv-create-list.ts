import { OPERATION_NAME, TNvCreatedList, TNvCreateListParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvCreateListTool extends OperationTool<TNvCreateListParams, TNvCreatedList> {
  public override readonly name = 'nv_create_list' as const;
  public override readonly operationName = OPERATION_NAME.nvCreateList;
  protected override readonly schema = z.object({
    type: z.enum(['lead', 'account']),
    name: z.string().trim().min(1).max(75),
    description: z.string().max(350).optional(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Plus-only root action nv.createList. Create an owned lead or account list. Name is trimmed (1–75 characters). Optional description has surrounding spaces trimmed, allows up to 350 characters after trimming, and is omitted when blank. Same-type names equal after trimming, case-sensitive, including system lists, return listAlreadyExists and create nothing. Final data is { id: string, name, type, url }. English interface only; errors also include interfaceLanguageNotSupported, noSalesNavigator and unexpectedError. Returns a workflow acknowledgement; use get_workflow_result with operationName nvCreateList.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['lead', 'account'],
            description: 'Owned list type to create.',
          },
          name: {
            type: 'string',
            minLength: 1,
            description: 'Name, trimmed; 1–75 characters after trimming.',
          },
          description: {
            type: 'string',
            maxLength: 350,
            description:
              'Optional description; surrounding spaces are trimmed. Up to 350 characters after trimming; blank omitted.',
          },
        },
        required: ['type', 'name'],
      },
    };
  }
}
