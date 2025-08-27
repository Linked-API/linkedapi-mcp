import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { TWorkflowCompletion, TWorkflowDefinition } from 'linkedapi-node';
import { z } from 'zod';

import { LinkedApiProgressNotification } from '../../types/index.js';
import { OperationTool } from '../linked-api-tool.js';

export class ExecuteCustomWorkflowTool extends OperationTool<
  TWorkflowDefinition,
  TWorkflowCompletion
> {
  public override readonly name = 'execute_custom_workflow';
  protected override readonly schema = z.object({
    definition: z.any(),
  });

  constructor(
    linkedapi: LinkedApi,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(linkedapi.customWorkflow, progressCallback);
  }

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
