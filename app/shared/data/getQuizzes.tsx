import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Quiz } from '~/shared/types';

export async function getQuizzes() {
  const q = query(
    collection(db, 'quizzes'),
    orderBy('createdAt'),
  ).withConverter(genericConverter<Quiz>());

  const quizzesQuerySnapshot = await getDocs(q);

  return quizzesQuerySnapshot.docs.map((doc) => doc.data());
}
