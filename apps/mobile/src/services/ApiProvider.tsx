import React, { PropsWithChildren, createContext, useContext } from 'react';
import { apiClient } from './api';

const ApiContext = createContext(apiClient);

export function ApiProvider({ children }: PropsWithChildren): React.JSX.Element {
  return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>;
}

export const useApiClient = () => useContext(ApiContext);
