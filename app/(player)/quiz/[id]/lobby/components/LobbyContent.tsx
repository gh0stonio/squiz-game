'use client';
import 'client-only';
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
        <p>Please wait for the quiz to start</p>
      ) : (
        <p>Please choose your team first to participate</p>
      );
    })
    .with({ status: 'in progress' }, () => {
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
