import intervalToDuration from 'date-fns/intervalToDuration';
import React from 'react';

import { Question } from '../types';

export function getTimeLeft(question: Question) {
  if (!question.startedAt) return;

  return Math.max(
    Math.floor(
      (question.duration * 1000 - (Date.now() - question.startedAt)) / 1000,
    ),
    0,
  );
}

interface TimerProps {
  question: Question;
  onDone?: () => Promise<void>;
}
export default function Timer({ question, onDone }: TimerProps) {
  const onDoneCalledRef = React.useRef(false);
  const intervalRef = React.useRef<NodeJS.Timer | undefined>();
  const timeLeftRef = React.useRef(getTimeLeft(question));
  const [duration, setDuration] = React.useState(
    timeLeftRef.current
      ? intervalToDuration({
          start: 0,
          end: timeLeftRef.current * 1000,
        })
      : undefined,
  );

  React.useEffect(() => {
    if (timeLeftRef.current === 0) return;

    intervalRef.current = setInterval(async () => {
      const timeLeft = getTimeLeft(question);

      if (timeLeft === undefined || onDoneCalledRef.current) return;

      if (timeLeft === 0) {
        clearInterval(intervalRef.current);
        if (onDone && !onDoneCalledRef.current) {
          onDoneCalledRef.current = true;
          await onDone();
        }

        return;
      }

      setDuration(
        intervalToDuration({
          start: 0,
          end: timeLeft * 1000,
        }),
      );
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [onDone, question, timeLeftRef, onDoneCalledRef]);

  return (
    <span>
      Time left:{' '}
      <span className="countdown font-mono font-semibold">
        {/* 
                // @ts-ignore */}
        <span style={{ '--value': duration?.minutes }}></span>:
        {/* 
                // @ts-ignore */}
        <span style={{ '--value': duration?.seconds }}></span>
      </span>
    </span>
  );
}
