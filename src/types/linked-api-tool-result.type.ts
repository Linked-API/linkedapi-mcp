import type {
  TMappedResponse,
  TOperationName,
  TWorkflowInProgressResponse,
  TWorkflowStartedResponse,
} from '@linkedapi/node';

export type TWorkflowAck = (TWorkflowStartedResponse | TWorkflowInProgressResponse) & {
  operationName: TOperationName;
};

export type TLinkedApiToolResult<TResult> = TWorkflowAck | TMappedResponse<TResult>;
