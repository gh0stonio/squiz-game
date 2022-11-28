import 'server-only';

import { getQuizzes } from '~/shared/data/getQuizzes';

import NewQuizButton from './components/NewQuizButton';
import QuizList from './components/QuizList';
import AdminHomePageDataContextProvider from './context';

export default async function AdminPage() {
  const quizzes = await getQuizzes();

  return (
    <AdminHomePageDataContextProvider quizzes={quizzes}>
      <div className="flex flex-col p-10">
        <div className="flex w-full items-center justify-between pb-6">
          <h2 className="w-full text-2xl font-bold">Quiz List</h2>
          <div className="flex items-center justify-center pr-1">
            <NewQuizButton />
          </div>
        </div>

        <QuizList />
      </div>
    </AdminHomePageDataContextProvider>
  );
}
