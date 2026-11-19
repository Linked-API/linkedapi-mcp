import LinkedApi, {
  SIGNAL_STATUS,
  SIGNAL_TYPE,
  TGetSignalsParams,
  TGetSignalsResult,
  TMappedResponse,
} from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { LinkedApiTool } from '../utils/linked-api-tool.js';

export class GetSignalsTool extends LinkedApiTool<TGetSignalsParams, TGetSignalsResult> {
  public readonly name = 'get_signals';
  // Usually called with no arguments at all, which some clients send as an absent object.
  protected readonly schema = z
    .object({
      type: z.enum(Object.values(SIGNAL_TYPE)).optional(),
      status: z.enum(Object.values(SIGNAL_STATUS)).optional(),
    })
    .default({});

  public override async execute({
    linkedapi,
    args: { type, status },
  }: {
    linkedapi: LinkedApi;
    args: TGetSignalsParams;
  }): Promise<TMappedResponse<TGetSignalsResult>> {
    return linkedapi.getSignals({
      type,
      status,
    });
  }

  public override getTool(): Tool {
    return {
      name: this.name,
      description:
        "List the account's signals (created with create_signal). Each signal has id (pass it as signalId to the other signal tools), type, its target fields, label, status, stoppedReason, createdAt, baselineAt (when the first check completed, or null until then), lastCheckedAt and nextCheckAt (the planned next check, or null when the signal is not active; your workflows and working hours can move it). status is active (checked on schedule), paused, or stopped: Linked API stopped checking because the target can no longer be watched, and stoppedReason is targetNotFound, watchPeriodEnded, noSalesNavigator (a listAlerts account without an active Sales Navigator subscription) or listTooLarge (a listAlerts list too large to watch). A stopped signal cannot be resumed; delete it and create it again.",
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: Object.values(SIGNAL_TYPE),
            description: 'Optional. Return only signals of this type.',
          },
          status: {
            type: 'string',
            enum: Object.values(SIGNAL_STATUS),
            description: 'Optional. Return only signals with this status.',
          },
        },
        required: [],
      },
    };
  }
}
