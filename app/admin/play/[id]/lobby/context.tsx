'use client';
import 'client-only';
import { type DefinedUseQueryResult, useQuery } from '@tanstack/react-query';
import React from 'react';

import { getQuestions } from '~/shared/data/getQuestions';
import { getQuiz } from '~/shared/data/getQuiz';
import { Question, Quiz } from '~/shared/types';

interface AdminQuizLobbyPageDataContext {
  quiz: {
    queryKey: (string | undefined)[];
    query: DefinedUseQueryResult<Quiz | undefined, unknown>;
  };
  questions: {
    queryKey: (string | undefined)[];
    query: DefinedUseQueryResult<Question[] | undefined, unknown>;
  };
}
export const adminQuizLobbyPageDataContext =
  React.createContext<AdminQuizLobbyPageDataContext>(
    {} as AdminQuizLobbyPageDataContext,
  );

interface AdminQuizLobbyPageDataContextProviderProps {
  quiz?: Quiz;
  questions?: Question[];
}
export default function AdminQuizLobbyPageDataContextProvider({
  children,
  quiz,
  questions,
}: React.PropsWithChildren<AdminQuizLobbyPageDataContextProviderProps>) {
  const queryKey = ['quiz', quiz?.id];
  const query = useQuery({
    queryKey,
    queryFn: () => getQuiz(quiz?.id),
    initialData: quiz,
    enabled: !!quiz,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const questionsQueryKey = ['quiz', quiz?.id, 'questions'];
  const questionsQuery = useQuery({
    queryKey: questionsQueryKey,
    queryFn: () => getQuestions(quiz?.id),
    initialData: questions,
    enabled: !!quiz,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <adminQuizLobbyPageDataContext.Provider
      value={{
        quiz: { queryKey, query },
        questions: { queryKey: questionsQueryKey, query: questionsQuery },
      }}
    >
      {children}
    </adminQuizLobbyPageDataContext.Provider>
  );
}
