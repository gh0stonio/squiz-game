'use client';
import 'client-only';
import { type DefinedUseQueryResult, useQuery } from '@tanstack/react-query';
import React from 'react';

import { getQuizzes } from '~/shared/data/getQuizzes';
import { Quiz } from '~/shared/types';

interface AdminHomePageDataContext {
  queryKey: (string | undefined)[];
  query: DefinedUseQueryResult<Quiz[] | undefined, unknown>;
}
export const adminHomePageDataContext =
  React.createContext<AdminHomePageDataContext>({} as AdminHomePageDataContext);

interface AdminHomePageDataContextProviderProps {
  quizzes: Quiz[];
}
export default function AdminHomePageDataContextProvider({
  children,
  quizzes,
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
    <adminHomePageDataContext.Provider value={{ query, queryKey }}>
      {children}
    </adminHomePageDataContext.Provider>
  );
}
