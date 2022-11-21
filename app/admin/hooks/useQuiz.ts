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
  orderBy,
  query,
} from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';
import { uid } from 'uid';

import { queryClient, QueryContext } from '~/admin/QueryContext';
import { getQuiz } from '~/shared/data/getQuiz';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { Question, Quiz } from '~/shared/types';

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

  /**
   * Questions handling
   */
  const deleteQuestion = React.useCallback(
    (questionId: string) => {
      queryClient.setQueryData<Quiz>(['quiz', quizId], (_quiz) => {
        if (!_quiz) return;

        return {
          ..._quiz,
          questions: (_quiz.questions || []).filter(
            (_question) => _question.id !== questionId,
          ),
        };
      });
    },
    [quizId],
  );
  const addQuestion = React.useCallback(
    (question: Question) => {
      queryClient.setQueryData<Quiz>(['quiz', quizId], (_quiz) => {
        if (!_quiz) return;

        return {
          ..._quiz,
          questions: [...(_quiz.questions || []), question],
        };
      });
    },
    [quizId],
  );
  const editQuestion = React.useCallback(
    (question: Question) => {
      queryClient.setQueryData<Quiz>(['quiz', quizId], (_quiz) => {
        if (!_quiz) return;

        return {
          ..._quiz,
          questions: (_quiz.questions || []).map((_question) =>
            _question.id === question.id ? question : _question,
          ),
        };
      });
    },
    [quizId],
  );

  return {
    quiz: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    saveQuiz,
    questions: result.data?.questions || [],
    addQuestion,
    editQuestion,
    deleteQuestion,
  };
}
