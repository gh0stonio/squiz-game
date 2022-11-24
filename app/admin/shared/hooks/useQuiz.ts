'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import {
  updateDoc,
  setDoc,
  doc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';
import { uid } from 'uid';

import { queryClient, QueryContext } from '~/admin/QueryContext';
import { getQuiz } from '~/shared/data/getQuiz';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { Question, Quiz, Team } from '~/shared/types';

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

  // Listening for quiz teams changes
  React.useEffect(() => {
    if (!result.data?.id) return;

    const quizTeamsQuery = query(
      collection(db, 'quizzes', `${result.data.id}`, 'teams').withConverter(
        genericConverter<Team>(),
      ),
    );
    const unsubscribe = onSnapshot(quizTeamsQuery, (teamsSnapshot) => {
      const teams = teamsSnapshot.docs.map((doc) => doc.data());

      queryClient.setQueryData<Quiz>(['quiz', quizId], (oldData) =>
        oldData ? { ...oldData, teams } : undefined,
      );
    });

    return unsubscribe;
  }, [quizId, result.data?.id]);

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
      )
        .then(async () => {
          if (isEdit) {
            // Deleting all existing questions of a quiz
            const questionsQuerySnapshot = await getDocs(
              collection(db, 'quizzes', quiz.id, 'questions').withConverter(
                genericConverter<Question>(),
              ),
            );
            questionsQuerySnapshot.forEach(async (questionDoc) => {
              await deleteDoc(
                doc(db, 'quizzes', quiz.id, 'questions', questionDoc.id),
              );
            });
          }

          const questions = queryClient.getQueryData<Quiz>([
            'quiz',
            quizId,
          ])?.questions;
          if (questions) {
            return Promise.all(
              questions.map((question) =>
                setDoc(
                  doc(
                    db,
                    'quizzes',
                    quiz?.id || id,
                    'questions',
                    question.id,
                  ).withConverter(genericConverter<Question>()),
                  {
                    ...question,
                    duration: parseInt(question.duration.toString(), 10),
                    maxPoints: parseInt(question.maxPoints.toString(), 10),
                  },
                ),
              ),
            );
          }
        })
        .then(
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
    [quizId, result.data, router],
  );

  const updateStatus = React.useCallback(
    async (status: Quiz['status']) => {
      if (!result.data) return;

      // removing sub_collections to avoid storing them inside the quiz attribute in Firestore
      const quiz = { ...result.data, status };
      delete quiz.questions;
      delete quiz.teams;

      await updateDoc(
        doc(db, 'quizzes', quiz.id).withConverter(genericConverter<Quiz>()),
        quiz,
      );

      queryClient.setQueryData<Quiz>(['quiz', quizId], (oldData) =>
        oldData ? { ...oldData, status } : oldData,
      );
    },
    [quizId, result.data],
  );

  const start = React.useCallback(() => {
    if (!result.data) return;

    return updateStatus('in progress');
  }, [result.data, updateStatus]);

  const end = React.useCallback(async () => {
    if (!result.data) return;
    return updateStatus('finished');
  }, [result.data, updateStatus]);

  const reset = React.useCallback(async () => {
    if (!result.data || !quizId) return;

    await Promise.all(
      (result.data.questions || []).map((question) => {
        delete question.startedAt;

        setDoc(
          doc(db, 'quizzes', quizId, 'questions', question.id).withConverter(
            genericConverter<Question>(),
          ),
          { ...question, status: 'ready' },
        );
      }),
    );

    return updateStatus('ready');
  }, [quizId, result.data, updateStatus]);

  return {
    quiz: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    saveQuiz,
    start,
    end,
    reset,
  };
}
