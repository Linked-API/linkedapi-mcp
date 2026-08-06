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
    case 'outsideWorkingHours':
      return {
        message: `${error.message} Retry once the account working hours reopen, or ask the account owner to change the off-hours policy.`,
        type: error.type,
        retryable: false,
      };
    case 'workingHoursWaitExpired':
      return {
        message: `${error.message} Start it again inside the account working hours.`,
        type: error.type,
        retryable: false,
      };
  }
  return {
    message: error.message,
    type: error.type,
  };
}
