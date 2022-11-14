'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import { onSnapshot, doc, collection, query } from 'firebase/firestore';
import React from 'react';

import { queryClient, QueryContext } from '~/(player)/quiz/[id]/QueryContext';
import { getQuiz } from '~/shared/data/getQuiz';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Quiz, Team } from '~/shared/types';

const queryKey = ['quiz'];

export function useQuiz() {
  const {
    initialData: { quiz },
  } = React.useContext(QueryContext);

  const result = useQuery({
    queryKey,
    queryFn: () => getQuiz(quiz?.id),
    initialData: quiz,
    enabled: !!quiz,
  });

  // Listening for quiz attributes changes
  React.useEffect(() => {
    if (!result.data?.id) return;

    const quizQuery = doc(db, 'quizzes', `${result.data.id}`).withConverter(
      genericConverter<Quiz>(),
    );
    const unsubscribe = onSnapshot(quizQuery, (quizDoc) => {
      queryClient.setQueryData<Quiz>(queryKey, quizDoc.data());
    });

    return unsubscribe;
  }, [result.data?.id]);

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
      queryClient.setQueryData<Quiz>(queryKey, (oldData) =>
        oldData ? { ...oldData, teams } : undefined,
      );
    });

    return unsubscribe;
  }, [result.data?.id]);

  return {
    quiz: result.data as Quiz,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
  };
}
