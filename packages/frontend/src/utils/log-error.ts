// import React from 'react';
// import Bugsnag from '@bugsnag/js';
// import BugsnagPluginReact from '@bugsnag/plugin-react';
// import BugsnagPerformance from '@bugsnag/browser-performance';

// import { VITE_BUGSNAG_API_KEY } from './constants';

// if (VITE_BUGSNAG_API_KEY) {
//   Bugsnag.start({
//     apiKey: VITE_BUGSNAG_API_KEY,
//     plugins: [new BugsnagPluginReact()],
//   });
//   BugsnagPerformance.start({ apiKey: VITE_BUGSNAG_API_KEY });
// }

// export const errorLoggingEnabled = !!VITE_BUGSNAG_API_KEY;

// export const LogErrorBoundary = VITE_BUGSNAG_API_KEY
//   ? Bugsnag.getPlugin('react')!.createErrorBoundary(React)
//   : ({ children }: any) => children;

// export function logError(error: Error) {
//   let errors: any[] = [error];
//   let safety = 0;
//   while (errors[errors.length - 1].cause && safety < 10) {
//     errors.push('::caused by::', errors[errors.length - 1].cause);
//     safety += 1;
//   }
//   console.error(...errors);

//   if (VITE_BUGSNAG_API_KEY) {
//     Bugsnag.notify(error);
//   }
// }

export const LogErrorBoundary = ({ children }: any) => children;
