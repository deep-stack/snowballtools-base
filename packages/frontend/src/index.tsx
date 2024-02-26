import React from 'react';
import ReactDOM from 'react-dom/client';
import assert from 'assert';
import { GQLClient } from 'gql-client';

import { ThemeProvider } from '@material-tailwind/react';

import './index.css';
import '@fontsource/inter';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GQLClientProvider } from './context/GQLClientContext';
import { SERVER_GQL_PATH } from './constants';
import { Toaster } from 'components/shared/Toast';
import Web3ModalProvider from './context/Web3ModalProvider';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

assert(
  process.env.REACT_APP_SERVER_URL,
  'REACT_APP_SERVER_URL is not set in env',
);
const gqlEndpoint = `${process.env.REACT_APP_SERVER_URL}/${SERVER_GQL_PATH}`;

const gqlClient = new GQLClient({ gqlEndpoint });

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <GQLClientProvider client={gqlClient}>
        <Web3ModalProvider>
          <App />
        </Web3ModalProvider>
        <Toaster />
      </GQLClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
