import { LinkedApiError, LinkedApiWorkflowTimeoutError } from '@linkedapi/node';

import { authenticationPrompt } from '../prompts';

export function handleLinkedApiError(error: LinkedApiError): Record<string, unknown> {
  if (error instanceof LinkedApiWorkflowTimeoutError) {
    const { message, workflowId, operationName } = error;
    return {
      status: 'workflow_running',
      message,
      workflowId,
      operationName,
      nextAction: {
        tool: 'get_workflow_result',
        arguments: {
          workflowId,
          operationName,
        },
        repeatUntil: 'final data is returned or the tool returns Completed',
      },
      userMessage:
        'Linked API is still working through the cloud-browser workflow. I will keep checking the existing workflow instead of starting a duplicate request.',
    };
  }
  switch (error.type) {
    case 'identificationTokenRequired':
    case 'linkedApiTokenRequired':
    case 'invalidLinkedApiToken':
    case 'invalidIdentificationToken':
      return {
        message: authenticationPrompt,
      };
  }
  return {
    message: error.message,
    type: error.type,
  };
}
