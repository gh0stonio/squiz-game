'use client';
import 'client-only';
import { match } from 'ts-pattern';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import useTeam from '~/(player)/quiz/[id]/hooks/useTeam';
import useAuth from '~/shared/hooks/useAuth';

import TeamList from './TeamList';

export default function TeamContent() {
  const { quiz } = useQuiz();
  const { teams } = useTeam();

  return match(quiz)
    .with({ status: 'in progress' }, () => {
      return <p>Quiz ongoing... can&apos;t change now</p>;
    })
    .with({ status: 'ready' }, () =>
      teams ? <TeamList /> : <p>no teams available</p>,
    )
    .with({ status: 'finished' }, () => {
      return <p>Quiz over, thanks for your participation!</p>;
    })
    .exhaustive();
}
