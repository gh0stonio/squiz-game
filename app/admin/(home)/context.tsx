'use client';
import 'client-only';
import { type DefinedUseQueryResult, useQuery } from '@tanstack/react-query';
import React from 'react';

import { getQuizzes } from '~/shared/data/getQuizzes';
import { Question, Quiz } from '~/shared/types';

interface AdminHomePageDataContext {
  queryKey: (string | undefined)[];
  query: DefinedUseQueryResult<Quiz[] | undefined, unknown>;
  questions: Question[];
}
export const adminHomePageDataContext =
  React.createContext<AdminHomePageDataContext>({} as AdminHomePageDataContext);

interface AdminHomePageDataContextProviderProps {
  quizzes: Quiz[];
  questions: Question[];
}
export default function AdminHomePageDataContextProvider({
  children,
  quizzes,
  questions,
}: React.PropsWithChildren<AdminHomePageDataContextProviderProps>) {
  const queryKey = ['quizzes'];

  const query = useQuery({
    queryKey,
    queryFn: getQuizzes,
    initialData: quizzes,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <adminHomePageDataContext.Provider value={{ query, queryKey, questions }}>
      {children}
    </adminHomePageDataContext.Provider>
  );
}
