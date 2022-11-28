'use client';
import 'client-only';
import React from 'react';

import { queryClient } from '~/admin/context';
import { Question, Quiz } from '~/shared/types';

import useQuiz from './useQuiz';

export default function useQuizQuestion() {
  const { quiz } = useQuiz();

  const deleteQuestion = React.useCallback(
    (questionId: string) => {
      if (!quiz) return;

      queryClient.setQueryData<Quiz>(['quiz', quiz.id], (_quiz) => {
        if (!_quiz) return;

        return {
          ..._quiz,
          questions: (_quiz.questions || []).filter(
            (_question) => _question.id !== questionId,
          ),
        };
      });
    },
    [quiz],
  );

  const addQuestion = React.useCallback(
    (question: Question) => {
      if (!quiz) return;

      queryClient.setQueryData<Quiz>(['quiz', quiz.id], (_quiz) => {
        if (!_quiz) return;

        return {
          ..._quiz,
          questions: [...(_quiz.questions || []), question],
        };
      });
    },
    [quiz],
  );
  const editQuestion = React.useCallback(
    (question: Question) => {
      if (!quiz) return;

      queryClient.setQueryData<Quiz>(['quiz', quiz.id], (_quiz) => {
        if (!_quiz) return;

        return {
          ..._quiz,
          questions: (_quiz.questions || []).map((_question) =>
            _question.id === question.id ? question : _question,
          ),
        };
      });
    },
    [quiz],
  );

  return {
    questions: quiz?.questions || [],
    addQuestion,
    editQuestion,
    deleteQuestion,
  };
}
