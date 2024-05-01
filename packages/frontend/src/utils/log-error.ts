import Bugsnag from '@bugsnag/js';

export function logError(error: Error) {
  if (import.meta.env.VITE_BUGSNAG_API_KEY) {
    Bugsnag.notify(error);
  }
}
