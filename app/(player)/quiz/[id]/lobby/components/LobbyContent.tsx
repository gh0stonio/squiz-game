'use client';
import 'client-only';
import { match, P } from 'ts-pattern';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';

import Correction from './Correction';
import OngoingQuestion from './OngoingQuestion';

export default function LobbyContent() {
  const { quiz } = useQuiz();

  return match(quiz)
    .with({ status: 'ready', myTeam: P.optional(P.nullish) }, () => {
      return <p>Please choose your team first</p>;
    })
    .with({ status: 'ready' }, () => {
      return <p>Please wait for the quiz to start</p>;
    })
    .with(
      {
        status: 'in progress',
        ongoingQuestion: P.optional(P.nullish),
      },
      () => {
        return <p>Quiz ongoing... wait for next question</p>;
      },
    )
    .with(
      { status: 'in progress', ongoingQuestion: P.not(P.nullish) },
      ({ ongoingQuestion }) =>
        ongoingQuestion.status === 'correcting' ? (
          <Correction question={ongoingQuestion} />
        ) : (
          <OngoingQuestion question={ongoingQuestion} />
        ),
    )
    .with({ status: 'finished' }, () => {
      return <p>Quiz over, thanks for your participation!</p>;
    })
    .exhaustive();
}
