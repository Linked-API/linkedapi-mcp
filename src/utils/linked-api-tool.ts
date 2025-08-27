import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Operation, TMappedResponse } from 'linkedapi-node';
import { LinkedApiProgressNotification } from 'src/utils/types';
import z from 'zod';

import { executeWithProgress } from './execute-with-progress';

export abstract class LinkedApiTool<TParams, TResult> {
  public abstract readonly name: string;
  protected abstract readonly schema: z.ZodSchema;
  protected readonly progressCallback: (progress: LinkedApiProgressNotification) => void;

  constructor(progressCallback: (progress: LinkedApiProgressNotification) => void) {
    this.progressCallback = progressCallback;
  }

  public abstract getTool(): Tool;

  public validate(args: unknown): TParams {
    return this.schema.parse(args) as TParams;
  }

  public abstract execute(
    args: TParams,
    progressToken?: string | number,
  ): Promise<TMappedResponse<TResult>>;
}

export abstract class OperationTool<TParams, TResult> extends LinkedApiTool<TParams, TResult> {
  private readonly operation: Operation<TParams, TResult>;

  constructor(
    operation: Operation<TParams, TResult>,
    progressCallback: (progress: LinkedApiProgressNotification) => void,
  ) {
    super(progressCallback);
    this.operation = operation;
  }

  public override execute(
    args: TParams,
    progressToken?: string | number,
  ): Promise<TMappedResponse<TResult>> {
    return executeWithProgress(this.progressCallback, this.operation, {
      params: args,
      progressToken,
    });
  }
}
