import 'server-only';

import FormTitle from './components/FormTitle';
import QuizForm from './components/QuizForm';

export default function AdminQuizFormPage() {
  return (
    <div className="flex h-full w-full flex-col p-10">
      <FormTitle />
      <QuizForm />

      <div id="question-form-modal" />
    </div>
  );
}
