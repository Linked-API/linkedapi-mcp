import LinkedApi, { TDeleteSignalResult, TMappedResponse, TSignalIdParams } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class DeleteSignalTool extends LinkedApiTool<TSignalIdParams, TDeleteSignalResult> {
  public readonly name = 'delete_signal';
  protected readonly schema = z.object({
    signalId: z.string().min(1),
  });

  public override async execute({
    linkedapi,
    args: { signalId },
  }: {
    linkedapi: LinkedApi;
    args: TSignalIdParams;
  }): Promise<TMappedResponse<TDeleteSignalResult>> {
    return linkedapi.deleteSignal({ signalId });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        'Delete a signal; returns { deleted: true }. Its checks stop immediately. Events it already produced stay available in get_signal_events until their 90 days run out. To watch the target of a stopped signal again, delete it and create it again with create_signal. Fails with signalNotFound for an unknown id.',
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
