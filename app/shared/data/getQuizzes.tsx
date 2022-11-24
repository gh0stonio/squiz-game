import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz, Team } from '~/shared/types';

export async function getQuizzes() {
  // Fetching Quiz collection
  const q = query(
    collection(db, 'quizzes'),
    orderBy('createdAt'),
  ).withConverter(genericConverter<Quiz>());

  const quizzesQuerySnapshot = await getDocs(q);

  const promises = quizzesQuerySnapshot.docs.map(async (quizDoc) => {
    const questionsQuerySnapshot = await getDocs(
      query(
        collection(db, 'quizzes', quizDoc.id, 'questions'),
        orderBy('createdAt'),
      ).withConverter(genericConverter<Question>()),
    );

    const teamsQuerySnapshot = await getDocs(
      collection(db, 'quizzes', quizDoc.id, 'teams').withConverter(
        genericConverter<Team>(),
      ),
    );

    const quiz: Quiz = {
      ...quizDoc.data(),
      questions: questionsQuerySnapshot.docs.map((questionDoc) =>
        questionDoc.data(),
      ),
      teams: teamsQuerySnapshot.docs.map((teamDoc) => teamDoc.data()),
    };

    return quiz;
  });

  return await Promise.all(promises);
}
