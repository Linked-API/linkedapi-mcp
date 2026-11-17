import LinkedApi, { TMappedResponse, TSignal, TSignalIdParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class PauseSignalTool extends LinkedApiTool<TSignalIdParams, TSignal> {
  public readonly name = 'pause_signal';
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
    return linkedapi.pauseSignal({ signalId });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Pause a signal and return it. A paused signal is not checked and spends nothing; its events stay available in get_signal_events, and it does not count toward the active signal limit. Pausing an already paused signal changes nothing and succeeds. Resume it with resume_signal. Fails with signalNotFound for an unknown id and with signalStopped for a stopped signal.',
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
