'use client';
import 'client-only';

import { useQuiz } from '../hooks';

export default function NextQuestion() {
  const { quiz, questions, nextQuestion } = useQuiz();

  if (!nextQuestion) return null;

  return (
    <div>
      <h3 className="w-full text-2xl font-semibold">
        Next Question - {nextQuestion.order}/{questions.length}
      </h3>

      <p>{nextQuestion.text}</p>
      <p>{nextQuestion.answer}</p>
    </div>
  );
}
