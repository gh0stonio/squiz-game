'use client';
import 'client-only';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import type { Quiz, Team } from '~/shared/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const QueryContext = React.createContext<{
  initialData: { quiz: Quiz; teams?: Team[] };
}>({ initialData: { quiz: {} as Quiz } });

interface QueryContextProps {
  initialData: { quiz: Quiz; teams?: Team[] };
}
export default function QueryContextProvider({
  children,
  initialData,
}: React.PropsWithChildren<QueryContextProps>) {
  return (
    <QueryContext.Provider value={{ initialData }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryContext.Provider>
  );
}
