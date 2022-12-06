'use client';
import 'client-only';
import { TfiFaceSad } from 'react-icons/tfi';
import { match, P } from 'ts-pattern';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import useTeam from '~/(player)/quiz/[id]/hooks/useTeam';

import Correction from './Correction';
import OngoingQuestion from './OngoingQuestion';

export default function LobbyContent() {
  const { quiz, ongoingQuestion } = useQuiz();
  const { myTeam } = useTeam();

  return match(quiz)
    .with({ status: 'ready' }, () => {
      return myTeam ? (
        <p>The game will start soon, be ready !</p>
      ) : (
        <p>
          <p>Please choose your team first to participate</p>
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
        ongoingQuestion.status === 'correcting' ? (
          <Correction question={ongoingQuestion} />
        ) : (
          <OngoingQuestion question={ongoingQuestion} />
        )
      ) : (
        <p>Quiz ongoing... wait for next question</p>
      );
    })
    .with({ status: 'finished' }, () => {
      return <p>Quiz over, thanks for your participation!</p>;
    })
    .exhaustive();
}
