import { OPERATION_NAME, TNvCreatedList, TNvRenameListParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class NvRenameListTool extends OperationTool<TNvRenameListParams, TNvCreatedList> {
  public override readonly name = 'nv_rename_list' as const;
  public override readonly operationName = OPERATION_NAME.nvRenameList;
  protected override readonly schema = z.object({
    listId: z.string().min(1),
    name: z
      .string()
      .trim()
      .min(1)
      .max(75)
      .regex(/^[^\r\n]+$/),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Rename an owned custom list. Trimmed name: 1–75 characters, no line breaks. Same name succeeds; duplicates return listAlreadyExists and system lists return listNotRenamable. Returns the renamed list with its id, name, type and url. English interface only. Plus required. Returns a workflow acknowledgement; use get_workflow_result with operationName nvRenameList.',
      inputSchema: {
        type: 'object',
        properties: {
          listId: {
            type: 'string',
            description: 'Owned list ID as a string, never a number.',
          },
          name: {
            type: 'string',
            description: 'Trimmed name, 1–75 characters without line breaks.',
            minLength: 1,
            maxLength: 75,
            pattern: '^[^\\r\\n]+$',
          },
        },
        required: ['listId', 'name'],
      },
    };
  }
}
