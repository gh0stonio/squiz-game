'use client';
import 'client-only';

import useQuiz from '~/admin/shared/hooks/useQuiz';

export default function NextQuestion() {
  const { nextQuestion } = useQuiz();

  if (!nextQuestion) return null;

  return (
    <div>
      <h3 className="w-full text-2xl font-semibold">Next Question</h3>

      <p>{nextQuestion.text}</p>
      <p>{nextQuestion.answer}</p>
    </div>
  );
}
