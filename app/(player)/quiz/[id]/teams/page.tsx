import 'server-only';

import TeamContent from './components/TeamContent';

export default async function QuizTeamPage() {
  return (
    <div className="flex h-full w-full flex-col p-10">
      <div className="pb-8">
        <h3 className="text-3xl font-bold">
          Choose the best team or create yours
        </h3>
        <h5 className="text-sm italic">
          From what I heard TEUFRON is the best one
        </h5>
      </div>

      <TeamContent />

      <div id="team-form-modal" />
    </div>
  );
}
