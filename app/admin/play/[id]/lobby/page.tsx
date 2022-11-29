import 'server-only';

import { getQuestions } from '~/shared/data/getQuestions';
import { getQuiz } from '~/shared/data/getQuiz';

import CurrentQuestion from './components/CurrentQuestion';
import Header from './components/Header';
import NextQuestion from './components/NextQuestion';
import AdminQuizLobbyPageDataContextProvider from './context';

export default async function AdminQuizPlayLobbyPage({
  params,
}: {
  params: { id: string };
}) {
  const quiz = await getQuiz(params.id);
  const questions = await getQuestions(params.id);

  return (
    <AdminQuizLobbyPageDataContextProvider quiz={quiz} questions={questions}>
      <div className="flex h-full w-full flex-col p-10">
        <div className="flex w-full items-center justify-between pt-2 pb-6">
          <Header />
        </div>

        <div className="flex h-full w-full flex-1 flex-col">
          <div className="flex-1">
            <CurrentQuestion />
          </div>

          <NextQuestion />
        </div>
      </div>
    </AdminQuizLobbyPageDataContextProvider>
  );
}
