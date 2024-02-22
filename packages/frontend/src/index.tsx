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
import Web3ModalProvider from './context/Web3ModalProvider';
import { SERVER_GQL_PATH } from './constants';

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
      <Web3ModalProvider>
        <GQLClientProvider client={gqlClient}>
          <App />
          <Toaster position="bottom-center" />
        </GQLClientProvider>
      </Web3ModalProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
