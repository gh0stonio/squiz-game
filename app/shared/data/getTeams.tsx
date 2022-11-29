import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { cache } from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Team } from '~/shared/types';

const getTeamsFromFirebase = cache(async (quizId: string) => {
  const teamsQuerySnapshot = await getDocs(
    query(collection(db, 'teams'), where('quizId', '==', quizId)).withConverter(
      genericConverter<Team>(),
    ),
  );

  return teamsQuerySnapshot.docs.map((doc) => doc.data());
});

export function getTeams(quizId?: string | null) {
  if (!quizId) return;

  return getTeamsFromFirebase(quizId);
}
