import 'server-only';

import Header from './components/Header';

export default async function AdminQuizPlayLobbyPage() {
  return (
    <div className="flex h-full w-full flex-col p-10">
      <div className="flex w-full items-center justify-between pt-2 pb-6">
        <Header />
      </div>

      <div className="flex h-full w-full flex-1 flex-col">Lobby</div>
    </div>
  );
}
