'use client';
import 'client-only';
import { updateDoc, doc, setDoc } from 'firebase/firestore';
import result from 'postcss/lib/result';
import React from 'react';

import { queryClient } from '~/admin/context';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { Question, Quiz } from '~/shared/types';

import { adminQuizLobbyPageDataContext } from './context';

export function useQuiz() {
  const {
    quiz: { queryKey: quizQueryKey, query: quizQuery },
    questions: { queryKey: questionsQueryKey, query: questionsQuery },
  } = React.useContext(adminQuizLobbyPageDataContext);

  const quiz = React.useMemo(() => quizQuery.data, [quizQuery.data]);
  const questions = React.useMemo(
    () => questionsQuery.data || [],
    [questionsQuery.data],
  );

  const updateStatus = React.useCallback(
    async (status: Quiz['status']) => {
      if (!quizQuery.data) return;

      const _quiz = { ...quizQuery.data, status };
      await updateDoc(
        doc(db, 'quizzes', _quiz.id).withConverter(genericConverter<Quiz>()),
        _quiz,
      );

      if (status === 'ready' || status === 'finished') {
        await Promise.all(
          questions.map((question) => {
            delete question.startedAt;

            setDoc(
              doc(db, 'questions', question.id).withConverter(
                genericConverter<Question>(),
              ),
              {
                ...question,
                answers: status === 'ready' ? [] : question.answers,
                status: status === 'ready' ? 'ready' : 'done',
              },
            );
          }),
        );
        queryClient.setQueryData<Question[]>(questionsQueryKey, (oldData) =>
          (oldData || []).map((_question) => ({
            ..._question,
            status: status === 'ready' ? 'ready' : 'done',
          })),
        );
      }

      queryClient.setQueryData<Quiz>(quizQueryKey, (oldData) =>
        oldData ? { ...oldData, status } : oldData,
      );
    },
    [questions, questionsQueryKey, quizQuery.data, quizQueryKey],
  );

  const start = React.useCallback(
    () => updateStatus('in progress'),
    [updateStatus],
  );
  const end = React.useCallback(() => updateStatus('finished'), [updateStatus]);
  const reset = React.useCallback(() => updateStatus('ready'), [updateStatus]);

  const currentQuestion = React.useMemo(() => {
    if (!questions) return;

    const onGoingQuestion = questions.find(
      (question) =>
        question.status === 'in progress' || question.status === 'correcting',
    );

    return (
      onGoingQuestion ||
      (questions.sort().filter((question) => question.status === 'ready') ||
        [])[0]
    );
  }, [questions]);
  const nextQuestion = React.useMemo(() => {
    return ((questions || [])
      .sort()
      .filter((question) => question.status === 'ready') || [])[
      currentQuestion && currentQuestion.status === 'ready' ? 1 : 0
    ];
  }, [questions, currentQuestion]);

  const pushQuestion = React.useCallback(async () => {
    if (!quiz || !currentQuestion) return;

    const updatedQuestion: Question = {
      ...currentQuestion,
      status: 'in progress',
      startedAt: Date.now(),
    };

    await setDoc(
      doc(db, 'questions', currentQuestion.id).withConverter(
        genericConverter<Question>(),
      ),
      updatedQuestion,
    );

    queryClient.setQueryData<Question[]>(questionsQueryKey, (oldData) =>
      (oldData || []).map((_question) =>
        _question.id === currentQuestion.id ? updatedQuestion : _question,
      ),
    );
  }, [currentQuestion, questionsQueryKey, quiz]);

  const sendQuestionExpired = React.useCallback(async () => {
    if (!quiz || !currentQuestion) return;

    const updatedQuestion: Question = {
      ...currentQuestion,
      status: 'correcting',
    };

    await setDoc(
      doc(db, 'questions', currentQuestion.id).withConverter(
        genericConverter<Question>(),
      ),
      updatedQuestion,
    );

    queryClient.setQueryData<Question[]>(questionsQueryKey, (oldData) =>
      (oldData || []).map((_question) =>
        _question.id === currentQuestion.id ? updatedQuestion : _question,
      ),
    );
  }, [currentQuestion, questionsQueryKey, quiz]);

  const saveAnswersCorrection = React.useCallback(
    async (answers: Question['answers']) => {
      if (!currentQuestion) return;

      await setDoc(
        doc(db, 'questions', currentQuestion.id).withConverter(
          genericConverter<Question>(),
        ),
        {
          ...currentQuestion,
          status: 'done',
          answers,
        },
      );
    },
    [currentQuestion],
  );

  return {
    quiz,
    questions,
    start,
    end,
    reset,
    currentQuestion,
    nextQuestion,
    pushQuestion,
    sendQuestionExpired,
    saveAnswersCorrection,
  };
}