'use client';
import 'client-only';
import { updateDoc, setDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';
import { uid } from 'uid';

import { queryClient } from '~/admin/context';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Quiz } from '~/shared/types';

import { adminQuizPageDataContext } from './context';

export default function useQuiz() {
  const router = useRouter();
  const { queryKey, query } = React.useContext(adminQuizPageDataContext);

  const quiz = React.useMemo(() => {
    return query.data;
  }, [query.data]);

  const saveQuiz = React.useCallback(
    (values: Pick<Quiz, 'name' | 'description' | 'maxMembersPerTeam'>) => {
      const isEdit = !!quiz;
      const id = quiz?.id || uid(16);
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
        : {
            ...values,
            id,
            status: 'ready',
            createdAt: Date.now(),
          };

      return saveDoc(
        doc(db, 'quizzes', id).withConverter(genericConverter<Quiz>()),
        savingQuiz,
      ).then(
        async () => {
          await queryClient.refetchQueries();

          if (!isEdit) {
            router.push(`/admin/form/${id}`);
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
    [quiz, router],
  );

  return { quiz, saveQuiz };
}
