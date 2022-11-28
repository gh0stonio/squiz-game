'use client';
import 'client-only';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import React from 'react';

import { queryClient } from '~/admin/context';
import { db } from '~/shared/lib/firebaseClient';
import { Quiz } from '~/shared/types';

import { adminHomePageDataContext } from './context';

export function useQuizzes() {
  const { queryKey, query } = React.useContext(adminHomePageDataContext);

  const deleteQuiz = React.useCallback(async (quizId: Quiz['id']) => {
    deleteDoc(doc(db, 'quizzes', quizId)).then(
      async () => {
        const quizzes = queryClient.getQueryData<Quiz[]>(['quizzes']);
        if (quizzes) {
          queryClient.setQueryData(
            ['quizzes'],
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
    quizzes: query.data || [],
    deleteQuiz,
  };
}
