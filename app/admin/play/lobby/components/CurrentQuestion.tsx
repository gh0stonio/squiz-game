'use client';
import 'client-only';
import clsx from 'clsx';
import { intervalToDuration } from 'date-fns';
import React from 'react';
import { match } from 'ts-pattern';

import useQuiz from '~/admin/shared/hooks/useQuiz';
import { useTimer } from '~/shared/hooks/useTimer';

export default function CurrentQuestion() {
  const { quiz, currentQuestion, pushQuestion, sendQuestionExpired } =
    useQuiz();
  const timer = useTimer(currentQuestion);
  const duration = timer.timeLeft
    ? intervalToDuration({
        start: 0,
        end: timer.timeLeft * 1000,
      })
    : undefined;

  React.useEffect(() => {
    timer.setIsExpired(false);
    if (timer.isExpired) {
      sendQuestionExpired();
    }
  }, [sendQuestionExpired, timer]);

  if (!currentQuestion)
    return <p>No question ready, please reset the quiz !</p>;

  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full">
        <h3 className="w-full text-2xl font-bold">
          Current Question - {currentQuestion.order}/{quiz?.questionsTotalCount}
        </h3>
        <button
          className={clsx('btn btn-secondary btn-sm', {
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

      {match(currentQuestion)
        .with({ status: 'in progress' }, () => {
          return (
            <div>
              Time left:{' '}
              <span className="countdown font-mono">
                {/* 
                // @ts-ignore */}
                <span style={{ '--value': duration?.minutes || 0 }}></span>:
                {/* 
                // @ts-ignore */}
                <span style={{ '--value': duration?.seconds }}></span>
              </span>
            </div>
          );
        })
        .with({ status: 'correcting' }, () => {
          return <div className="h-full py-6">Correction screen</div>;
        })
        .otherwise(() => null)}
    </div>
  );
}
