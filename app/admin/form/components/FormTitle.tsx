'use client';
import 'client-only';
import { useRouter } from 'next/navigation';
import { BiArrowBack } from 'react-icons/bi';

import useQuiz from '~/admin/hooks/useQuiz';

export default function QuizFormTitle() {
  const router = useRouter();
  const { quiz } = useQuiz();

  return (
    <div className="flex items-center justify-center">
      <BiArrowBack
        className="mr-3 h-6 w-6 cursor-pointer text-gray-600"
        onClick={() => router.push('/admin')}
      />
      <h2 className="w-full text-2xl font-bold">
        {quiz ? `Edit quiz "${quiz.name}"` : 'Create new quiz'}
      </h2>
    </div>
  );
}
