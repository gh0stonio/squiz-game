'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import { onSnapshot, doc, collection, query } from 'firebase/firestore';
import React from 'react';

import { queryClient, QueryContext } from '~/(player)/quiz/[id]/QueryContext';
import { getQuiz } from '~/shared/data/getQuiz';
import useAuth from '~/shared/hooks/useAuth';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz, Team } from '~/shared/types';

const queryKey = ['quiz'];

export default function useQuiz() {
  const {
    initialData: { quiz },
  } = React.useContext(QueryContext);

  const { user } = useAuth();

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

  // Listening for quiz attributes changes
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
      const myTeam = teams.find((team) =>
        team.members.some((member) => member.name === user?.name),
      );

      queryClient.setQueryData<Quiz>(queryKey, (oldData) =>
        oldData ? { ...oldData, teams, myTeam } : undefined,
      );
    });

    return unsubscribe;
  }, [result.data?.id, user?.name]);

  // Listening for quiz questions changes (only to get ongoingQuestion)
  React.useEffect(() => {
    if (!result.data?.id) return;

    const quizQuestionsQuery = query(
      collection(db, 'quizzes', `${result.data.id}`, 'questions').withConverter(
        genericConverter<Question>(),
      ),
    );
    const unsubscribe = onSnapshot(quizQuestionsQuery, (questionsSnapshot) => {
      const questions = questionsSnapshot.docs.map((doc) => doc.data());
      const ongoingQuestion = questions.find(
        (_question) =>
          _question.status === 'in progress' ||
          _question.status === 'correcting',
      );

      queryClient.setQueryData<Quiz>(
        queryKey,
        (oldData) => oldData && { ...oldData, ongoingQuestion },
      );
    });

    return unsubscribe;
  }, [result.data?.id, user?.name]);

  return {
    quiz: result.data as Quiz,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
  };
}
