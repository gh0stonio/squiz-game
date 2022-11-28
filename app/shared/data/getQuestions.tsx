import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
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
