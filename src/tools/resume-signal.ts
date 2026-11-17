import LinkedApi, { TMappedResponse, TSignal, TSignalIdParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class ResumeSignalTool extends LinkedApiTool<TSignalIdParams, TSignal> {
  public readonly name = 'resume_signal';
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
    return linkedapi.resumeSignal({ signalId });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Resume a paused signal and return it. Its first check reports what appeared while it was paused, as far as LinkedIn still shows it; it is not a new baseline. Resuming an active signal changes nothing and succeeds. Fails with signalLimitReached when the account already has the maximum number of active signals of this type (pause or delete one first), with signalStopped for a stopped signal or a postUrl signal whose 30-day watch period has ended, and with signalNotFound for an unknown id.',
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
