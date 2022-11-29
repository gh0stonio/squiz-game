'use client';
import 'client-only';
import { intervalToDuration } from 'date-fns';
import React from 'react';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import { useTimer } from '~/shared/hooks/useTimer';
import { type Question } from '~/shared/types';

interface OngoingQuestionProps {
  question: Question;
}

export default function OngoingQuestion({ question }: OngoingQuestionProps) {
  const { questionsCount } = useQuiz();
  const timer = useTimer(question);
  const duration = timer.timeLeft
    ? intervalToDuration({
        start: 0,
        end: timer.timeLeft * 1000,
      })
    : undefined;

  console.log(question);
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-bold">
          Question {question.order}/{questionsCount} - {question.text}
        </h2>
        <span>
          Time left:{' '}
          <span className="countdown font-mono">
            {/* 
                // @ts-ignore */}
            <span style={{ '--value': duration?.minutes || 0 }}></span>:
            {/* 
                // @ts-ignore */}
            <span style={{ '--value': duration?.seconds }}></span>
          </span>
        </span>
      </div>

      <textarea className="textarea-bordered textarea h-60" name="answer" />
    </>
  );
}
