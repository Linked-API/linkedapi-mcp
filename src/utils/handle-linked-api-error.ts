import { LinkedApiError } from '@linkedapi/node';

import { authenticationPrompt } from '../prompts';

export function handleLinkedApiError(error: LinkedApiError): Record<string, unknown> {
  switch (error.type) {
    case 'identificationTokenRequired':
    case 'linkedApiTokenRequired':
    case 'invalidLinkedApiToken':
    case 'invalidIdentificationToken':
      return {
        message: authenticationPrompt,
      };
    case 'trialLimitReached':
      return {
        message: error.message,
        type: error.type,
        retryable: false,
      };
  }
  return {
    message: error.message,
    type: error.type,
  };
}
