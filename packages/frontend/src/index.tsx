import React from 'react';
import ReactDOM from 'react-dom/client';
import assert from 'assert';
import { Toaster } from 'react-hot-toast';
import { GQLClient } from 'gql-client';

import { ThemeProvider } from '@material-tailwind/react';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GQLClientProvider } from './context/GQLClientContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const gqlEndpoint = process.env.REACT_APP_GQL_SERVER_URL;
assert(gqlEndpoint, 'GQL server URL not provided');

const gqlClient = new GQLClient({ gqlEndpoint });

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <GQLClientProvider client={gqlClient}>
        <App />
        <Toaster position="bottom-center" />
      </GQLClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
