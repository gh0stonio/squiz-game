'use client';
import 'client-only';
import clsx from 'clsx';
import { format } from 'date-fns';
import Link from 'next/link';
import { BsPlayFill } from 'react-icons/bs';
import { HiTrash, HiPencil, HiLink } from 'react-icons/hi';
import React from 'react';

import { useQuizzes } from '../hooks';

export default function QuizList() {
  const { quizzes, deleteQuiz } = useQuizzes();

  return (
    <div className="w-full overflow-auto">
      <table className="table w-full">
        <thead className="sticky top-0">
          <tr className="h-12 [&>th]:bg-gray-200">
            <th className="w-6/12">Name</th>
            <th className="w-1/12 text-end">Questions</th>
            <th className="w-1/12 text-end">Created At</th>
            <th className="w-1/12 text-end">Updated At</th>
            <th className="w-1/12 text-end">Status</th>
            <th className="w-2/12 text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => {
              return (
                <tr key={quiz.id} className="h-12">
                  <td>{quiz.name}</td>
                  <td className="text-end">TODO</td>
                  <td className="text-end">
                    {format(new Date(quiz.createdAt), 'MM/dd/yyyy')}
                  </td>
                  <td className="text-end">
                    {quiz.updatedAt &&
                      format(new Date(quiz.updatedAt), 'MM/dd/yyyy')}
                  </td>
                  <td className="text-end">
                    <span
                      className={clsx(
                        'badge border-0 bg-green-500 text-white',
                        {
                          'bg-blue-500': quiz.status === 'ready',
                          'bg-green-500': quiz.status === 'in progress',
                          'bg-red-500': quiz.status === 'finished',
                        },
                      )}
                    >
                      {quiz.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <Link href={`/admin/play/${quiz.id}/lobby`}>
                        <BsPlayFill className="h-8 w-8 cursor-pointer pl-3 text-gray-400" />
                      </Link>
                      <HiLink
                        className="h-8 w-8 cursor-pointer pl-3 text-gray-400"
                        onClick={() => {
                          const url = new URL(window.location.href);
                          navigator.clipboard.writeText(
                            `https://${url.hostname}/login?referer=/quiz/${quiz.id}/lobby`,
                          );
                        }}
                      />

                      <Link href={`/admin/form/${quiz.id}`}>
                        <HiPencil className="h-8 w-8 cursor-pointer pl-3 text-gray-400" />
                      </Link>
                      <HiTrash
                        className="h-8 w-8 cursor-pointer pl-3 text-gray-400"
                        onClick={() => deleteQuiz(quiz.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="h-12">
              <td colSpan={7}>
                <span className="flex w-full items-center justify-center">
                  No quiz yet
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
