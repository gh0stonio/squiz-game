'use client';
import 'client-only';
import clsx from 'clsx';
import React from 'react';
import { match, P } from 'ts-pattern';

import Timer, { getTimeLeft } from '~/shared/components/Timer';

import { useQuiz } from '../hooks';

import Corrections from './Corrections';

export default function CurrentQuestion() {
  const { quiz, questions, currentQuestion, pushQuestion } = useQuiz();
  const [isCorrecting, setIsCorrecting] = React.useState(
    currentQuestion && getTimeLeft(currentQuestion) === 0,
  );

  React.useEffect(() => {
    setIsCorrecting(currentQuestion && getTimeLeft(currentQuestion) === 0);
  }, [currentQuestion]);

  if (quiz?.status === 'finished')
    return <p>Quiz finished, to replay just reset it !</p>;

  if (!currentQuestion)
    return (
      <p>
        No question available, should not happen if the quiz is not finished !
      </p>
    );

  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full">
        <h3 className="w-full text-2xl font-bold">
          Current Question - {currentQuestion.order}/{questions.length}
        </h3>
        <button
          className={clsx('btn-secondary btn-sm btn', {
            'btn-disabled':
              quiz?.status !== 'in progress' ||
              currentQuestion.status !== 'ready',
          })}
          onClick={pushQuestion}
        >
          Push
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-6/12">
          <p className="pt-4 pb-2 text-xl font-semibold">Questions</p>
          <p className="">{currentQuestion.text}</p>
        </div>
        <div className="w-4/12">
          <p className="pt-4 pb-2 text-xl font-semibold">Correct Answer</p>
          <p className="">{currentQuestion.answer}</p>
        </div>
        <div className="flex w-2/12 justify-end gap-4">
          <div>
            <p className="pt-4 pb-2 text-xl font-semibold">Duration</p>
            <p className="">{currentQuestion.duration}</p>
          </div>
          <div>
            <p className="pt-4 pb-2 text-xl font-semibold">Points</p>
            <p className="">{currentQuestion.maxPoints}</p>
          </div>
        </div>
      </div>

      <div className="flex h-full w-full pt-4">
        {match(currentQuestion)
          .with({ status: 'in progress' }, () => {
            if (isCorrecting) return <Corrections />;

            return (
              <div>
                <Timer
                  question={currentQuestion}
                  onDone={async () => {
                    setIsCorrecting(true);
                  }}
                />
              </div>
            );
          })
          .otherwise(() => null)}
      </div>
    </div>
  );
}
