import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

// Tools backed by public Linked API endpoints: they get no client and run without any token.
export abstract class PublicTool<TParams, TResult> {
  public abstract readonly name: string;
  protected abstract readonly schema: z.ZodSchema;

  public abstract getTool(): Tool;

  public validate(args: unknown): TParams {
    return this.schema.parse(args) as TParams;
  }

  public abstract execute({ args }: { args: TParams }): Promise<TResult>;
}
