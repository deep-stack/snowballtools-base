import React, { createContext, useContext, ReactNode } from 'react';
import { GQLClient } from 'gql-client';

const GQLClientContext = createContext({} as GQLClient);

export const GQLClientProvider = ({
  client,
  children,
}: {
  children: ReactNode;
  client: GQLClient;
}) => (
  <GQLClientContext.Provider value={client}>
    {children}
  </GQLClientContext.Provider>
);

export const useGQLClient = () => {
  const client = useContext(GQLClientContext);
  if (!client) {
    throw new Error('useGQLClient must be used within a GQLClientProvider');
  }
  return client;
};
