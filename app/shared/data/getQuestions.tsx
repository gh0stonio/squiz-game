import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { cache } from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question } from '~/shared/types';

const getQuestionsFromFirebase = cache(async (quizId: string) => {
  const questionsQuerySnapshot = await getDocs(
    query(
      collection(db, 'questions'),
      orderBy('order'),
      where('quizId', '==', quizId),
    ).withConverter(genericConverter<Question>()),
  );

  return questionsQuerySnapshot.docs.map((doc) => doc.data());
});

export function getQuestions(quizId?: string | null) {
  if (!quizId) return;

  return getQuestionsFromFirebase(quizId);
}

const getAllQuestionsFromFirebase = cache(async () => {
  const questionsQuerySnapshot = await getDocs(
    query(collection(db, 'questions'), orderBy('order')).withConverter(
      genericConverter<Question>(),
    ),
  );

  return questionsQuerySnapshot.docs.map((doc) => doc.data());
});
export function getAllQuestions() {
  return getAllQuestionsFromFirebase();
}

const getOngoingQuestionFromFirebase = cache(async (quizId: string) => {
  const questionsQuerySnapshot = await getDocs(
    query(
      collection(db, 'questions'),
      orderBy('order'),
      where('quizId', '==', quizId),
      where('status', 'in', ['in progress', 'correcting']),
      limit(1),
    ).withConverter(genericConverter<Question>()),
  );

  const questions = questionsQuerySnapshot.docs.map((doc) => doc.data()) || [];

  return questions[0];
});
export function getOngoingQuestion(quizId: string) {
  return getOngoingQuestionFromFirebase(quizId);
}

const getQuestionsCountFromFirebase = cache(async (quizId: string) => {
  const snapshot = await getCountFromServer(
    query(collection(db, 'questions'), where('quizId', '==', quizId)),
  );

  return snapshot.data().count;
});
export function getQuestionsCount(quizId: string) {
  return getQuestionsCountFromFirebase(quizId);
}
