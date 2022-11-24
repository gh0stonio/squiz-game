import React from 'react';

import type { Question } from '~/shared/types';

export const useTimer = (question?: Question) => {
  const [timeLeft, setTimeLeft] = React.useState<number>();
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    if (!question || !question.startedAt) {
      return;
    }
    const timeSinceOngoing = Date.now() - question.startedAt;

    setTimeLeft(
      Math.floor((question.duration * 1000 - timeSinceOngoing) / 1000),
    );

    const timerId = setInterval(() => {
      if (!question.startedAt || question.status !== 'in progress') {
        return;
      }

      const timeSinceOngoing = Date.now() - question.startedAt;

      if (timeSinceOngoing > question.duration * 1000) {
        setIsExpired(true);
        clearInterval(timerId);
        return;
      }

      setTimeLeft((current) => (current && current > 0 ? current - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [question]);

  return { timeLeft, isExpired, setIsExpired };
};
