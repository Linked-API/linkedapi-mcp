import LinkedApi, { TMappedResponse, TSignal, TSignalIdParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class GetSignalTool extends LinkedApiTool<TSignalIdParams, TSignal> {
  public readonly name = 'get_signal';
  protected readonly schema = z.object({
    signalId: z.string().min(1),
  });

  public override async execute({
    linkedapi,
    args: { signalId },
  }: {
    linkedapi: LinkedApi;
    args: TSignalIdParams;
  }): Promise<TMappedResponse<TSignal>> {
    return linkedapi.getSignal({ signalId });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Get one signal by its id, in the same shape as get_signals returns it: status, stoppedReason, baselineAt, lastCheckedAt, nextCheckAt, target fields and label. Fails with signalNotFound when the account has no signal with this id.',
      inputSchema: {
        type: 'object',
        properties: {
          signalId: {
            type: 'string',
            minLength: 1,
            description: 'Signal id, as returned by create_signal or get_signals.',
          },
        },
        required: ['signalId'],
      },
    };
  }
}
