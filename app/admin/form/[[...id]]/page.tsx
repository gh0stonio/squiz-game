import 'server-only';

import { getQuestions } from '~/shared/data/getQuestions';
import { getQuiz } from '~/shared/data/getQuiz';

import FormTitle from './components/FormTitle';
import QuizForm from './components/QuizForm';
import AdminQuizPageDataContext from './context';

export default async function AdminQuizFormPage({
  params,
}: {
  params: { id?: string[] };
}) {
  const quiz = await getQuiz(params.id && params.id[0]);
  const questions = await getQuestions(params.id && params.id[0]);

  return (
    <AdminQuizPageDataContext quiz={quiz} questions={questions}>
      <div className="flex h-full w-full flex-col p-10">
        <FormTitle />
        <QuizForm />

        <div id="question-form-modal" />
      </div>
    </AdminQuizPageDataContext>
  );
}
