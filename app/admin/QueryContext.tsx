'use client';
import 'client-only';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import type { Quiz } from '~/shared/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const QueryContext = React.createContext<{
  initialData: { quizzes: Quiz[] };
}>({ initialData: { quizzes: [] } });

interface QueryContextProps {
  initialData: { quizzes: Quiz[] };
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
