'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import { id } from 'date-fns/locale';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import React from 'react';

import { queryClient, QueryContext } from '~/admin/QueryContext';
import { getQuizzes } from '~/shared/data/getQuizzes';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { Question, Quiz, Team } from '~/shared/types';

const queryKey = ['quizzes'];

export default function useQuizzes() {
  const {
    initialData: { quizzes },
  } = React.useContext(QueryContext);

  const result = useQuery({
    queryKey,
    queryFn: getQuizzes,
    initialData: quizzes,
    enabled: !!quizzes,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // Clearing server cache avoiding outdated data
  if (!process.browser) {
    queryClient.clear();
  }

  React.useEffect(() => {
    const unsubs: Unsubscribe[] = [];

    unsubs.push(
      // Listening for quizzes attributes changes
      onSnapshot(
        query(collection(db, 'quizzes'), orderBy('createdAt')).withConverter(
          genericConverter<Quiz>(),
        ),
        (querySnapshot) => {
          querySnapshot.docs.map((quizDoc) => {
            if (quizDoc.metadata.hasPendingWrites) return;

            // Listening for quizzes teams changes
            const teamsQuery = query(
              collection(db, 'quizzes', `${quizDoc.id}`, 'teams').withConverter(
                genericConverter<Team>(),
              ),
            );
            unsubs.push(
              onSnapshot(teamsQuery, (snapshot) => {
                const data = queryClient.getQueryData<Quiz[]>(queryKey);
                queryClient.setQueryData<Quiz[]>(
                  queryKey,
                  data?.map((quiz) =>
                    quiz.id === quizDoc.id
                      ? {
                          ...quiz,
                          teams: snapshot.docs.map((doc) => doc.data()),
                        }
                      : quiz,
                  ),
                );
              }),
            );

            // Listening for quizzes questions changes
            const questionsQuery = query(
              collection(
                db,
                'quizzes',
                `${quizDoc.id}`,
                'questions',
              ).withConverter(genericConverter<Question>()),
              orderBy('createdAt'),
            );
            unsubs.push(
              onSnapshot(questionsQuery, (snapshot) => {
                const data = queryClient.getQueryData<Quiz[]>(queryKey);
                queryClient.setQueryData<Quiz[]>(
                  queryKey,
                  data?.map((quiz) =>
                    quiz.id === quizDoc.id
                      ? {
                          ...quiz,
                          questions: snapshot.docs.map((doc) => doc.data()),
                        }
                      : quiz,
                  ),
                );
              }),
            );
          });

          const data = queryClient.getQueryData<Quiz[]>(queryKey);
          queryClient.setQueryData<Quiz[]>(
            queryKey,
            querySnapshot.docs.map((quizDoc) => ({
              ...data?.find((_quiz) => _quiz.id === quizDoc.id),
              ...quizDoc.data(),
            })),
          );
        },
      ),
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  return {
    quizzes: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
  };
}
