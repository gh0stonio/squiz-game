import 'server-only';

import TeamList from './components/TeamList';

export default async function AdminQuizPlayTeamsPage() {
  return (
    <div className="flex h-full w-full flex-col p-10">
      <h3 className="pb-6 text-3xl font-bold">List of playing teams</h3>

      <TeamList />
    </div>
  );
}
