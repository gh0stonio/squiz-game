'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import { updateDoc, setDoc, doc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';
import { uid } from 'uid';

import { queryClient, QueryContext } from '~/admin/QueryContext';
import { getQuiz } from '~/shared/data/getQuiz';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { Quiz } from '~/shared/types';

export default function useQuiz() {
  const router = useRouter();
  const {
    initialData: { quizzes },
  } = React.useContext(QueryContext);
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');

  const result = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId, { isForAdmin: true }),
    initialData: quizzes.find((quiz) => quiz.id === quizId),
    enabled: !!quizId,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // Clearing server cache avoiding outdated data
  if (!process.browser) {
    queryClient.clear();
  }

  const saveQuiz = React.useCallback(
    (values: Pick<Quiz, 'name' | 'description' | 'maxMembersPerTeam'>) => {
      const quiz = result.data;
      const id = quiz?.id || uid(16);

      const isEdit = !!quiz;
      const saveDoc = isEdit ? updateDoc : setDoc;

      const savingQuiz: Quiz = isEdit
        ? {
            ...quiz,
            ...values,
            maxMembersPerTeam: parseInt(
              values.maxMembersPerTeam.toString(),
              10,
            ),
            updatedAt: Date.now(),
          }
        : { ...values, id, status: 'ready', createdAt: Date.now() };

      delete savingQuiz.questions;
      delete savingQuiz.teams;

      return saveDoc(
        doc(db, 'quizzes', id).withConverter(genericConverter<Quiz>()),
        savingQuiz,
      ).then(
        async () => {
          await queryClient.refetchQueries();

          if (!isEdit) {
            router.push(`/admin/form?id=${id}`);
            await new Promise((r) => setTimeout(r, 1000));
          }

          toast.success(`Quiz ${isEdit ? 'updated' : 'added'} !`, {
            theme: 'colored',
          });
        },
        () => {
          toast.error(`Failed ${isEdit ? 'updating' : 'adding'} the Quiz !`, {
            theme: 'colored',
          });
        },
      );
    },
    [result.data, router],
  );

  return {
    quiz: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    saveQuiz,
  };
}
