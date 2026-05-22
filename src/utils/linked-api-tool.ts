import LinkedApi, { Operation, TOperationName } from '@linkedapi/node';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

import type { TLinkedApiToolResult, TWorkflowAck } from '../types/linked-api-tool-result.type.js';

interface TLinkedApiToolExecuteOptions<TParams> {
  linkedapi: LinkedApi;
  args: TParams;
  mcpClient: string;
}

export abstract class LinkedApiTool<TParams, TResult> {
  public abstract readonly name: string;
  protected abstract readonly schema: z.ZodSchema;

  public abstract getTool(): Tool;

  public validate(args: unknown): TParams {
    return this.schema.parse(args) as TParams;
  }

  public abstract execute(
    options: TLinkedApiToolExecuteOptions<TParams>,
  ): Promise<TLinkedApiToolResult<TResult>>;
}

export abstract class OperationTool<TParams, TResult> extends LinkedApiTool<TParams, TResult> {
  public abstract readonly operationName: TOperationName;

  public override async execute({
    linkedapi,
    args,
  }: TLinkedApiToolExecuteOptions<TParams>): Promise<TWorkflowAck> {
    const operation = linkedapi.operations.find(
      (operation) => operation.operationName === this.operationName,
    )! as Operation<TParams, TResult>;
    const response = await operation.execute(args);
    return { ...response,
operationName: this.operationName };
  }
}
