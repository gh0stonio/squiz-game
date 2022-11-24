import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { cache } from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz, Team, User } from '~/shared/types';

const getQuizFromFirebase = cache(
  async (id: string, params: { user?: User; isForAdmin?: boolean } = {}) => {
    // Fetching Quiz document
    const docSnap = await getDoc(
      doc(db, 'quizzes', `${id}`).withConverter(genericConverter<Quiz>()),
    );
    if (!docSnap.exists()) return;

    // Fetching Questions sub-collection
    let questions: Question[] = [];
    if (params.isForAdmin) {
      const questionsQuerySnapshot = await getDocs(
        query(
          collection(db, 'quizzes', docSnap.id, 'questions'),
          orderBy('createdAt'),
        ).withConverter(genericConverter<Question>()),
      );
      questions = questionsQuerySnapshot.docs.map((doc) => doc.data());
    }

    // Fetching Teams sub-collection
    const teamsQuerySnapshot = await getDocs(
      collection(db, 'quizzes', docSnap.id, 'teams').withConverter(
        genericConverter<Team>(),
      ),
    );
    const teams = teamsQuerySnapshot.docs.map((doc) => doc.data());
    const myTeam = teams.find((team) =>
      team.members.some((member) => member.name === params.user?.name),
    );

    return {
      ...docSnap.data(),
      questions,
      teams,
      ...(params.isForAdmin ? {} : { myTeam }),
    };
  },
);

export function getQuiz(
  id?: string | null,
  params?: { user?: User; isForAdmin?: boolean },
) {
  if (!id) return;

  return getQuizFromFirebase(id, params);
}
