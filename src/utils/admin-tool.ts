import { LinkedApiAdmin } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

export abstract class AdminTool<TParams, TResult> {
  public abstract readonly name: string;
  protected abstract readonly schema: z.ZodSchema;

  public abstract getTool(): Tool;

  public validate(args: unknown): TParams {
    return this.schema.parse(args) as TParams;
  }

  public abstract execute({
    admin,
    args,
  }: {
    admin: LinkedApiAdmin;
    args: TParams;
  }): Promise<TResult>;
}
