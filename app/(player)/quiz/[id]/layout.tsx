import 'server-only';
import React from 'react';

import NavBar from '~/shared/components/NavBar';
import { getQuiz } from '~/shared/data/getQuiz';
import { getUser } from '~/shared/data/getUser';

import QueryContext from './QueryContext';

export default async function PlayerLayout({
  children,
  params,
}: React.PropsWithChildren<{ params: { id: string } }>) {
  const user = await getUser();
  const quiz = await getQuiz(params.id, { user });

  if (!quiz) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="m-auto flex h-5/6 w-11/12 items-center justify-center rounded-xl bg-gray-100 text-3xl shadow-xl">
          No quiz found for this id
        </div>
      </div>
    );
  }

  return (
    <QueryContext initialData={{ quiz }}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <NavBar />

        <div className="m-auto mb-10 h-5/6 w-[95%] rounded-xl bg-gray-100 shadow-xl">
          {children}
        </div>
      </div>
    </QueryContext>
  );
}
