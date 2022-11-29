'use client';
import 'client-only';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import type { Quiz, Team, Question } from '~/shared/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const QueryContext = React.createContext<{
  initialData: {
    quiz: Quiz;
    teams?: Team[];
    ongoingQuestion?: Question;
    questionsCount: number;
  };
}>({ initialData: { quiz: {} as Quiz, questionsCount: 0 } });

interface QueryContextProps {
  initialData: {
    quiz: Quiz;
    teams?: Team[];
    ongoingQuestion?: Question;
    questionsCount: number;
  };
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
