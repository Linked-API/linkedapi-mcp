import { OPERATION_NAME, TWorkflowCompletion, TWorkflowDefinition } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { OperationTool } from '../utils/linked-api-tool.js';

const SINGLE_ACTION_WORKFLOW_SCHEMA = z.looseObject({
  actionType: z.string().min(1),
});
const WORKFLOW_DEFINITION_SCHEMA = z.union([
  SINGLE_ACTION_WORKFLOW_SCHEMA,
  z.array(SINGLE_ACTION_WORKFLOW_SCHEMA).min(1),
]);
const EXECUTE_CUSTOM_WORKFLOW_SCHEMA = z.union([
  WORKFLOW_DEFINITION_SCHEMA,
  z
    .object({
      definition: WORKFLOW_DEFINITION_SCHEMA,
    })
    .transform(({ definition }) => definition),
]);

export class ExecuteCustomWorkflowTool extends OperationTool<
  TWorkflowDefinition,
  TWorkflowCompletion
> {
  public override readonly name = 'execute_custom_workflow';
  public override readonly operationName = OPERATION_NAME.customWorkflow;
  protected override readonly schema = EXECUTE_CUSTOM_WORKFLOW_SCHEMA;

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Execute a custom workflow definition. Pass a single action with actionType and its parameters at the top level. A single-action or array definition can alternatively be passed in definition. If this workflow is still running, do not retry this tool; retrying can duplicate any write actions inside the custom workflow.',
      inputSchema: {
        type: 'object',
        properties: {
          actionType: {
            type: 'string',
            minLength: 1,
            description: 'The action type for a single-action workflow.',
          },
          definition: {
            description: 'A single-action or array workflow definition.',
            oneOf: [
              {
                type: 'object',
                properties: {
                  actionType: {
                    type: 'string',
                    minLength: 1,
                  },
                },
                required: ['actionType'],
                additionalProperties: true,
              },
              {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    actionType: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['actionType'],
                  additionalProperties: true,
                },
              },
            ],
          },
        },
        anyOf: [{ required: ['actionType'] }, { required: ['definition'] }],
        additionalProperties: true,
      },
    };
  }
}
