'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import {
  onSnapshot,
  doc,
  collection,
  limit,
  orderBy,
  query,
  where,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import React from 'react';

import { queryClient, QueryContext } from '~/(player)/quiz/[id]/context';
import { getQuiz } from '~/shared/data/getQuiz';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz, Team } from '~/shared/types';

const queryKey = ['quiz'];

export default function useQuiz() {
  const {
    initialData: {
      quiz,
      ongoingQuestion: initialOngoingQuestion,
      questionsCount,
    },
  } = React.useContext(QueryContext);

  const [ongoingQuestion, setOngoingQuestion] = React.useState(
    initialOngoingQuestion,
  );

  const result = useQuery({
    queryKey,
    queryFn: () => getQuiz(quiz.id),
    initialData: quiz,
    enabled: !!quiz,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // Clearing server cache avoiding outdated data
  if (!process.browser) {
    queryClient.clear();
  }

  // Listening for quiz changes
  React.useEffect(() => {
    if (!result.data?.id) return;

    const quizQuery = doc(db, 'quizzes', `${result.data.id}`).withConverter(
      genericConverter<Quiz>(),
    );
    const unsubscribe = onSnapshot(quizQuery, (quizDoc) => {
      queryClient.setQueryData<Quiz>(queryKey, (oldData) =>
        oldData ? { ...oldData, ...quizDoc.data() } : quizDoc.data(),
      );
    });

    return unsubscribe;
  }, [result.data?.id]);

  // Listening for ongoingQuestion changes
  React.useEffect(() => {
    if (!result.data?.id) return;

    const ongoingQuestionQuery = query(
      collection(db, 'questions'),
      orderBy('order'),
      where('quizId', '==', result.data.id),
      where('status', '==', 'in progress'),
      limit(1),
    ).withConverter(genericConverter<Question>());
    const unsubscribe = onSnapshot(ongoingQuestionQuery, (snapshot) => {
      setOngoingQuestion((snapshot.docs.map((doc) => doc.data()) || [])[0]);
    });

    return unsubscribe;
  }, [result.data?.id]);

  const sendAnswer = React.useCallback(
    async (myTeam: Team, answer: string) => {
      if (!ongoingQuestion) return;

      await updateDoc(
        doc(db, 'questions', ongoingQuestion.id).withConverter(
          genericConverter<Question>(),
        ),
        {
          answers: arrayUnion({
            team: myTeam.name,
            value: answer,
          }),
        },
      );
    },
    [ongoingQuestion],
  );

  return {
    quiz: result.data as Quiz,
    ongoingQuestion,
    questionsCount,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    sendAnswer,
  };
}
