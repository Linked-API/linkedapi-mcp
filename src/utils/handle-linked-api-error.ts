import { LinkedApiError, LinkedApiWorkflowTimeoutError } from 'linkedapi-node';

import { authenticationPrompt } from '../prompts';

export function handleLinkedApiError(error: LinkedApiError): object {
  if (error instanceof LinkedApiWorkflowTimeoutError) {
    const { message, workflowId, operationName } = error;
    return {
      message,
      workflowId,
      operationName,
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
