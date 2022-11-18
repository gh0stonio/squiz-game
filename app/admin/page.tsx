import 'server-only';

import QuizList from './components/QuizList';

export default async function AdminPage() {
  return (
    <div className="flex flex-col p-10">
      <div className="flex w-full items-center justify-between pt-2 pb-6">
        <h2 className="w-full text-2xl font-bold">Quiz List</h2>
      </div>

      <QuizList />
    </div>
  );
}
