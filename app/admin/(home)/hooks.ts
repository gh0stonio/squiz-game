'use client';
import 'client-only';
import {
  collection,
  deleteDoc,
  doc,
  where,
  query,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import React from 'react';

import { queryClient } from '~/admin/context';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { Question, Quiz, Team } from '~/shared/types';

import { adminHomePageDataContext } from './context';

export function useQuizzes() {
  const {
    queryKey,
    query: { data },
    questions,
  } = React.useContext(adminHomePageDataContext);

  const deleteQuiz = React.useCallback(async (quizId: Quiz['id']) => {
    const batch = writeBatch(db);

    // Batching delete for all related teams
    const teamsQuerySnapshot = await getDocs(
      query(
        collection(db, 'teams'),
        where('quizId', '==', quizId),
      ).withConverter(genericConverter<Team>()),
    );
    teamsQuerySnapshot.docs.map((teamDoc) =>
      batch.delete(doc(db, 'teams', teamDoc.id)),
    );

    // Batching delete for all related questions
    const questionsQuerySnapshot = await getDocs(
      query(
        collection(db, 'questions'),
        where('quizId', '==', quizId),
      ).withConverter(genericConverter<Question>()),
    );
    questionsQuerySnapshot.docs.map((questionDoc) =>
      batch.delete(doc(db, 'questions', questionDoc.id)),
    );

    // TODO: delete file on storage

    // Deleting everything
    await batch.commit();

    await deleteDoc(doc(db, 'quizzes', quizId)).then(
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
    quizzes: data || [],
    questions,
    deleteQuiz,
  };
}
