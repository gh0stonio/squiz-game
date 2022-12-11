'use client';
import 'client-only';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TfiFaceSad } from 'react-icons/tfi';
import { match } from 'ts-pattern';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import useTeam from '~/(player)/quiz/[id]/hooks/useTeam';

import OngoingQuestion from './OngoingQuestion';

export default function LobbyContent() {
  const { quiz, ongoingQuestion } = useQuiz();
  const { myTeam } = useTeam();
  const pathName = usePathname();

  return match(quiz)
    .with({ status: 'ready' }, () => {
      return myTeam ? (
        <p>The game will start soon, be ready !</p>
      ) : (
        <p>
          Choose your team first or create one to participate (only team creator
          can submit answer on behalf of the team), it&apos;s{' '}
          <Link
            href={pathName?.replace('lobby', 'teams') as string}
            className="link-secondary link"
          >
            here
          </Link>
          .
        </p>
      );
    })
    .with({ status: 'in progress' }, () => {
      if (!myTeam) {
        return (
          <p>
            <TfiFaceSad className="h-10 w-10" />
            Oh no the quiz has started but you don&apos;t have a team yet, join
            one right now to participate !
          </p>
        );
      }
      return ongoingQuestion ? (
        <OngoingQuestion question={ongoingQuestion} />
      ) : (
        <p>Quiz ongoing... wait for next question</p>
      );
    })
    .with({ status: 'finished' }, () => {
      return <p>Quiz over, thanks for your participation!</p>;
    })
    .exhaustive();
}
