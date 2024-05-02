import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';
import React from 'react';

const bugsnagApiKey = import.meta.env.VITE_BUGSNAG_API_KEY;

if (bugsnagApiKey) {
  Bugsnag.start({
    apiKey: bugsnagApiKey,
    plugins: [new BugsnagPluginReact()],
  });
  BugsnagPerformance.start({ apiKey: bugsnagApiKey });
}

export const errorLoggingEnabled = !!bugsnagApiKey;

export const LogErrorBoundary = bugsnagApiKey
  ? Bugsnag.getPlugin('react')!.createErrorBoundary(React)
  : ({ children }: any) => children;

export function logError(error: Error) {
  let errors: any[] = [error];
  let safety = 0;
  while (errors[errors.length - 1].cause && safety < 10) {
    errors.push('::caused by::', errors[errors.length - 1].cause);
    safety += 1;
  }
  console.error(...errors);

  if (import.meta.env.VITE_BUGSNAG_API_KEY) {
    Bugsnag.notify(error);
  }
}
