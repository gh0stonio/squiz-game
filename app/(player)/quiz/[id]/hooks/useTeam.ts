'use client';
import 'client-only';
import { useQuery } from '@tanstack/react-query';
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayRemove,
  collection,
  onSnapshot,
  query,
  arrayUnion,
  where,
} from 'firebase/firestore';
import React from 'react';
import { uid } from 'uid';

import { queryClient, QueryContext } from '~/(player)/quiz/[id]/context';
import { getTeams } from '~/shared/data/getTeams';
import useAuth from '~/shared/hooks/useAuth';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Team, User } from '~/shared/types';

import useQuiz from './useQuiz';

export default function useTeam() {
  const { user } = useAuth();
  const { quiz } = useQuiz();

  const {
    initialData: { teams },
  } = React.useContext(QueryContext);

  const result = useQuery({
    queryKey: ['teams', quiz.id],
    queryFn: () => getTeams(quiz.id),
    initialData: teams,
    enabled: !!quiz,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const myTeam = React.useMemo(
    () =>
      (result.data || []).find((team) =>
        team.members.some((member) => member.name === user?.name),
      ),
    [result.data, user?.name],
  );

  // Listening for quiz teams changes
  React.useEffect(() => {
    const teamsQuery = query(
      collection(db, 'teams'),
      where('quizId', '==', quiz.id),
    ).withConverter(genericConverter<Team>());
    const unsubscribe = onSnapshot(teamsQuery, (teamsSnapshot) => {
      const teams = teamsSnapshot.docs.map((doc) => doc.data());
      queryClient.setQueryData<Team[]>(['teams', quiz.id], teams);
    });

    return unsubscribe;
  }, [quiz.id]);

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
        quizId: quiz.id,
        name,
        leader: user,
        members: [user],
      };

      setIsChangeOngoing(true);
      await setDoc(
        doc(db, 'teams', team.id).withConverter(genericConverter<Team>()),
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
        doc(db, 'teams', team.id).withConverter(genericConverter<Team>()),
        team,
      );
      setIsChangeOngoing(false);
    },
    [user],
  );

  const deleteTeam = React.useCallback(
    async (team: Team) => {
      if (!user || !checkIfLeader(team)) return;

      setIsChangeOngoing(true);
      await deleteDoc(doc(db, 'teams', team.id));
      setIsChangeOngoing(false);
    },
    [checkIfLeader, user],
  );

  const kickPlayer = React.useCallback(
    async (team: Team, kickedUser: User) => {
      if (!user || !checkIfLeader(team)) return;

      setIsChangeOngoing(true);
      await updateDoc(doc(db, 'teams', team.id), {
        members: arrayRemove(kickedUser),
      });
      setIsChangeOngoing(false);
    },
    [checkIfLeader, user],
  );

  const joinTeam = React.useCallback(
    async (team: Team) => {
      if (!user) return;

      setIsChangeOngoing(true);

      await updateDoc(doc(db, 'teams', team.id), {
        members: arrayUnion(user),
      });

      setIsChangeOngoing(false);
    },
    [user],
  );

  const leaveTeam = React.useCallback(
    async (team: Team) => {
      if (!user) return;

      setIsChangeOngoing(true);

      await updateDoc(doc(db, 'teams', team.id), {
        members: arrayRemove(user),
      });

      setIsChangeOngoing(false);
    },
    [user],
  );

  return {
    teams: result.data,
    myTeam,
    isChangeOngoing,
    checkIfLeader,
    createTeam,
    editTeam,
    deleteTeam,
    kickPlayer,
    joinTeam,
    leaveTeam,
  };
}
