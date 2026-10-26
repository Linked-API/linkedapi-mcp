import { LinkedApiAdmin } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import { unwrapValueEnvelope } from './unwrap-value-envelope.js';

export abstract class AdminTool<TParams, TResult> {
  public abstract readonly name: string;
  protected abstract readonly schema: z.ZodSchema;

  public abstract getTool(): Tool;

  public validate(args: unknown): TParams {
    return this.schema.parse(unwrapValueEnvelope(args, this.getTool().inputSchema)) as TParams;
  }

  public abstract execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TParams;
  }): Promise<TResult>;
}
