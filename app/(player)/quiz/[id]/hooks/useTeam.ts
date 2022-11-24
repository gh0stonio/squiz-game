'use client';
import 'client-only';
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore';
import React from 'react';
import { uid } from 'uid';

import useAuth from '~/shared/hooks/useAuth';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Team, User } from '~/shared/types';

import useQuiz from './useQuiz';

export default function useTeam() {
  const { user } = useAuth();
  const { quiz } = useQuiz();

  const [isChangeOngoing, setIsChangeOngoing] = React.useState(false);

  const checkIfLeader = React.useCallback(
    (team: Team) => team.leader.uid === user?.uid,
    [user?.uid],
  );

  const createTeam = React.useCallback(
    async (name: string) => {
      if (!user) return;

      const team: Team = {
        id: uid(16),
        name,
        leader: user,
        members: [user],
      };

      setIsChangeOngoing(true);
      await setDoc(
        doc(db, 'quizzes', quiz.id, 'teams', team.id).withConverter(
          genericConverter<Team>(),
        ),
        team,
      );
      setIsChangeOngoing(false);
    },
    [quiz, user],
  );

  const editTeam = React.useCallback(
    async (team: Team) => {
      if (!user) return;

      setIsChangeOngoing(true);
      await updateDoc(
        doc(db, 'quizzes', quiz.id, 'teams', team.id).withConverter(
          genericConverter<Team>(),
        ),
        team,
      );
      setIsChangeOngoing(false);
    },
    [quiz, user],
  );

  const deleteTeam = React.useCallback(
    async (team: Team) => {
      if (!user || !checkIfLeader(team)) return;

      setIsChangeOngoing(true);
      await deleteDoc(doc(db, 'quizzes', quiz.id, 'teams', team.id));
      setIsChangeOngoing(false);
    },
    [checkIfLeader, quiz, user],
  );

  const kickPlayer = React.useCallback(
    async (team: Team, kickedUser: User) => {
      if (!user || !checkIfLeader(team)) return;

      setIsChangeOngoing(true);
      await updateDoc(doc(db, 'quizzes', quiz.id, 'teams', team.id), {
        members: arrayRemove(kickedUser),
      });
      setIsChangeOngoing(false);
    },
    [checkIfLeader, quiz, user],
  );

  return {
    isChangeOngoing,
    checkIfLeader,
    createTeam,
    editTeam,
    deleteTeam,
    kickPlayer,
  };
}
