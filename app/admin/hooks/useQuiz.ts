'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { queryClient, QueryContext } from '~/admin/QueryContext';
import { getQuiz } from '~/shared/data/getQuiz';

export default function useQuiz() {
  const {
    initialData: { quizzes },
  } = React.useContext(QueryContext);
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');

  const result = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId, { forAdmin: true }),
    initialData: quizzes.find((quiz) => quiz.id === quizId),
    enabled: !!quizId,
    staleTime: 1000,
  });

  // Clearing server cache avoiding outdated data
  if (!process.browser) {
    queryClient.clear();
  }

  return {
    quiz: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
  };
}
