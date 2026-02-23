import { OPERATION_NAME, TWorkflowCompletion, TWorkflowDefinition } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

export class ExecuteCustomWorkflowTool extends OperationTool<
  TWorkflowDefinition,
  TWorkflowCompletion
> {
  public override readonly name = 'execute_custom_workflow';
  public override readonly operationName = OPERATION_NAME.customWorkflow;
  protected override readonly schema = z.object({
    definition: z.any(),
  });

  public override getTool(): Tool {
    return {
      name: this.name,
      description: 'Execute a custom workflow definition',
      inputSchema: {
        type: 'object',
        properties: { definition: { type: 'object' } },
        required: ['definition'],
      },
    };
  }
}
