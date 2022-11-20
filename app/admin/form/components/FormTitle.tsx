'use client';
import 'client-only';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BiArrowBack } from 'react-icons/bi';

import useQuiz from '~/admin/hooks/useQuiz';

export default function QuizFormTitle() {
  const { quiz } = useQuiz();

  return (
    <div className="flex items-center justify-center">
      <Link href="/admin">
        <BiArrowBack className="mr-3 h-6 w-6 cursor-pointer text-gray-600" />
      </Link>

      <h2 className="w-full text-2xl font-bold">
        {quiz ? `Edit quiz "${quiz.name}"` : 'Create new quiz'}
      </h2>
    </div>
  );
}
