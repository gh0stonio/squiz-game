import 'server-only';

import { getQuiz } from '~/shared/data/getQuiz';
import type { Quiz } from '~/shared/types';

import LobbyContent from './components/LobbyContent';

export default async function PlayerLobbyPage({
  params,
}: {
  params: { id: string };
}) {
  const quiz = (await getQuiz(params.id)) as Quiz;

  return (
    <div className="flex h-full w-full flex-col p-10">
      <div className="pb-8">
        <h3 className="text-3xl font-bold">
          Let&apos;s play to the quiz &quot;{quiz.name}&quot;!
        </h3>
        <p className="text-sm italic">{quiz.description}</p>
      </div>

      <LobbyContent />
    </div>
  );
}
