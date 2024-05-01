import React from 'react';
import ReactDOM from 'react-dom/client';
import assert from 'assert';
import { GQLClient } from 'gql-client';

import { ThemeProvider } from '@snowballtools/material-tailwind-react-fork';

import './index.css';
import '@fontsource/inter';
import '@fontsource-variable/jetbrains-mono';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GQLClientProvider } from './context/GQLClientContext';
import { SERVER_GQL_PATH } from './constants';
import { Toaster } from 'components/shared/Toast';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';

const bugsnagApiKey = import.meta.env.VITE_BUGSNAG_API_KEY;
if (bugsnagApiKey) {
  Bugsnag.start({
    apiKey: bugsnagApiKey,
    plugins: [new BugsnagPluginReact()],
  });
  BugsnagPerformance.start({ apiKey: bugsnagApiKey });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

assert(
  import.meta.env.VITE_SERVER_URL,
  'REACT_APP_SERVER_URL is not set in env',
);
const gqlEndpoint = `${import.meta.env.VITE_SERVER_URL}/${SERVER_GQL_PATH}`;

const gqlClient = new GQLClient({ gqlEndpoint });

const ErrorBoundary = bugsnagApiKey
  ? Bugsnag.getPlugin('react')!.createErrorBoundary(React)
  : ({ children }: any) => children;

root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <ThemeProvider>
        <GQLClientProvider client={gqlClient}>
          <App />
          <Toaster />
        </GQLClientProvider>
      </ThemeProvider>
    </React.StrictMode>
    ,
  </ErrorBoundary>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
