import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LinkedApi, { Operation, TMappedResponse, TOperationName } from '@linkedapi/node';
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

  public abstract execute({
    linkedapi,
    args,
    workflowTimeout,
    progressToken,
  }: {
    linkedapi: LinkedApi;
    args: TParams;
    workflowTimeout: number;
    progressToken?: string | number;
  }): Promise<TMappedResponse<TResult>>;
}

export abstract class OperationTool<TParams, TResult> extends LinkedApiTool<TParams, TResult> {
  public abstract readonly operationName: TOperationName;

  public override execute({
    linkedapi,
    args,
    workflowTimeout,
    progressToken,
  }: {
    linkedapi: LinkedApi;
    args: TParams;
    workflowTimeout: number;
    progressToken?: string | number;
  }): Promise<TMappedResponse<TResult>> {
    const operation = linkedapi.operations.find(
      (operation) => operation.operationName === this.operationName,
    )! as Operation<TParams, TResult>;
    return executeWithProgress(this.progressCallback, operation, workflowTimeout, {
      params: args,
      progressToken,
    });
  }
}
