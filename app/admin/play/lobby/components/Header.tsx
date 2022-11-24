'use client';
import 'client-only';
import clsx from 'clsx';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';

import useQuiz from '~/admin/shared/hooks/useQuiz';

export default function Header() {
  const { quiz, start, end, reset } = useQuiz();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-center">
        <Link href="/admin">
          <BiArrowBack className="mr-3 h-6 w-6 cursor-pointer text-gray-600" />
        </Link>

        <h2 className="text-2xl font-bold">Playing &quot;{quiz?.name}&quot;</h2>
      </div>

      <div className="flex gap-3">
        <button
          onClick={start}
          className={clsx('btn btn-success btn-sm', {
            'btn-disabled': quiz?.status !== 'ready',
          })}
        >
          Start
        </button>
        <button
          onClick={reset}
          className={clsx('btn btn-warning btn-sm', {
            'btn-disabled': quiz?.status === 'ready',
          })}
        >
          Reset
        </button>
        <button
          onClick={end}
          className={clsx('btn btn-error btn-sm', {
            'btn-disabled': quiz?.status !== 'in progress',
          })}
        >
          End
        </button>
      </div>
    </div>
  );
}
