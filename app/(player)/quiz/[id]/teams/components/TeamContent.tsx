'use client';
import 'client-only';
import { match } from 'ts-pattern';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import useTeam from '~/(player)/quiz/[id]/hooks/useTeam';
import useAuth from '~/shared/hooks/useAuth';

import TeamList from './TeamList';

function TeamListWrapper() {
  const { teams } = useTeam();
  return teams ? <TeamList /> : <p>no teams available</p>;
}

export default function TeamContent() {
  const { quiz } = useQuiz();

  return match(quiz)
    .with({ status: 'in progress' }, () => <TeamListWrapper />)
    .with({ status: 'ready' }, () => <TeamListWrapper />)
    .with({ status: 'finished' }, () => {
      return <p>Quiz over, thanks for your participation!</p>;
    })
    .exhaustive();
}
