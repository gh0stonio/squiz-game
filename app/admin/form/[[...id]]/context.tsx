'use client';
import 'client-only';
import { type DefinedUseQueryResult, useQuery } from '@tanstack/react-query';
import React from 'react';

import { getQuiz } from '~/shared/data/getQuiz';
import { Quiz } from '~/shared/types';

interface AdminQuizPageDataContext {
  queryKey: (string | undefined)[];
  query: DefinedUseQueryResult<Quiz | undefined, unknown>;
}
export const adminQuizPageDataContext =
  React.createContext<AdminQuizPageDataContext>({} as AdminQuizPageDataContext);

interface AdminQuizPageDataContextProviderProps {
  quiz?: Quiz;
}
export default function AdminQuizPageDataContextProvider({
  children,
  quiz,
}: React.PropsWithChildren<AdminQuizPageDataContextProviderProps>) {
  const queryKey = ['quiz', quiz?.id];

  const query = useQuery({
    queryKey,
    queryFn: () => getQuiz(quiz?.id),
    initialData: quiz,
    enabled: !!quiz,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <adminQuizPageDataContext.Provider value={{ query, queryKey }}>
      {children}
    </adminQuizPageDataContext.Provider>
  );
}
