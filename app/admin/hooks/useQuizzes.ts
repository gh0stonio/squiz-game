'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import React from 'react';

import { queryClient, QueryContext } from '~/admin/QueryContext';
import { getQuizzes } from '~/shared/data/getQuizzes';
import { db } from '~/shared/lib/firebaseClient';
import { Quiz } from '~/shared/types';

const queryKey = ['quizzes'];

export default function useQuizzes() {
  const {
    initialData: { quizzes },
  } = React.useContext(QueryContext);

  const result = useQuery({
    queryKey,
    queryFn: getQuizzes,
    initialData: quizzes,
    enabled: !!quizzes,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // Clearing server cache avoiding outdated data
  if (!process.browser) {
    queryClient.clear();
  }

  const deleteQuiz = React.useCallback(async (quizId: Quiz['id']) => {
    deleteDoc(doc(db, 'quizzes', quizId)).then(
      async () => {
        const quizzes = queryClient.getQueryData<Quiz[]>(queryKey);
        if (quizzes) {
          queryClient.setQueryData(
            queryKey,
            quizzes.filter((quiz) => quiz.id !== quizId),
          );
        }

        toast.success('Quiz deleted !', {
          theme: 'colored',
        });
      },
      () => {
        toast.error('Failed deleting the Quiz !', {
          theme: 'colored',
        });
      },
    );
  }, []);

  return {
    quizzes: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    deleteQuiz,
  };
}
