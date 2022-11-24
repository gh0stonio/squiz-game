'use client';
import 'client-only';
import React from 'react';

import { useTimer } from '~/shared/hooks/useTimer';
import { type Question } from '~/shared/types';

interface OngoingQuestionProps {
  question: Question;
}

export default function OngoingQuestion({ question }: OngoingQuestionProps) {
  const timer = useTimer(question);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-bold">{question.text}</h2>
        <span>Time left: {timer.timeLeft}</span>
      </div>

      <textarea className="textarea-bordered textarea h-60" name="answer" />
    </>
  );
}
