import { doc, getDoc } from 'firebase/firestore';
import { cache } from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Quiz } from '~/shared/types';

const getQuizFromFirebase = cache(async (quizId: string) => {
  const docSnapshot = await getDoc(
    doc(db, 'quizzes', `${quizId}`).withConverter(genericConverter<Quiz>()),
  );

  return docSnapshot.data();
});

export function getQuiz(quizId?: string | null) {
  if (!quizId) return;

  return getQuizFromFirebase(quizId);
}
