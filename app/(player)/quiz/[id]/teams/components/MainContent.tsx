'use client';
import 'client-only';
import { CgArrowTopRight } from 'react-icons/cg';
import { match } from 'ts-pattern';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import useTeam from '~/(player)/quiz/[id]/hooks/useTeam';
import useAuth from '~/shared/hooks/useAuth';

import TeamList from './TeamList';

export default function MainContent() {
  const { user } = useAuth();
  const { quiz } = useQuiz();
  const { teams } = useTeam();

  if (!user) {
    return (
      <span className="flex h-full w-full items-center justify-center text-3xl">
        Please log in first, it&apos;s up there on the right{' '}
        <CgArrowTopRight className="h-10 w-10" />
      </span>
    );
  }

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
