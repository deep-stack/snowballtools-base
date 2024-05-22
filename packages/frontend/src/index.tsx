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
import { LogErrorBoundary } from 'utils/log-error';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

assert(
  import.meta.env.VITE_SERVER_URL,
  'VITE_SERVER_URL is not set in env',
);
const gqlEndpoint = `${import.meta.env.VITE_SERVER_URL}/${SERVER_GQL_PATH}`;

const gqlClient = new GQLClient({ gqlEndpoint });

root.render(
  <LogErrorBoundary>
    <React.StrictMode>
      <ThemeProvider>
        <GQLClientProvider client={gqlClient}>
          <App />
          <Toaster />
        </GQLClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  </LogErrorBoundary>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
