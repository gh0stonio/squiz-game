'use client';
import 'client-only';
import clsx from 'clsx';
import React from 'react';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import useTeam from '~/(player)/quiz/[id]/hooks/useTeam';
import { Team } from '~/shared/types';

import TeamFormModal from './TeamFormModal';

export default function TeamList() {
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [editingTeam, setEditingTeam] = React.useState<Team>();

  const { quiz } = useQuiz();
  const { isChangeOngoing, checkIfLeader } = useTeam();

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-end">
          <button
            type="button"
            className={clsx('btn-accent btn-sm btn mb-6', {
              'btn-disabled': !!quiz.myTeam,
            })}
            onClick={() => setIsFormModalOpen(true)}
          >
            Create Team
          </button>
        </div>

        <div className="-mx-4 overflow-auto px-4 pb-8">
          {!quiz.teams || quiz.teams.length === 0 ? (
            <p className="flex w-full items-center justify-center text-2xl">
              No team available yet
            </p>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {quiz.teams.map((team) => (
                <div key={team.id} className="card h-60 bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title flex w-full items-center justify-between">
                      <p>{team.name}</p>
                      <p className="flex items-center justify-end">
                        {team.members.length} / {quiz.maxMembersPerTeam}
                      </p>
                    </h2>
                    <div className="h-24 overflow-auto">
                      <p className="italic">Admin: {team.leader.name}</p>
                      <p className="italic">
                        Members:{' '}
                        {team.members.map((member) => member.name).join(',')}
                      </p>
                    </div>
                    <div className="card-actions flex justify-end">
                      {checkIfLeader(team) && (
                        <button
                          onClick={() => {
                            setEditingTeam(team);
                            setIsFormModalOpen(true);
                          }}
                          className={clsx('btn-secondary btn-sm btn', {
                            loading: isChangeOngoing,
                          })}
                        >
                          Admin
                        </button>
                      )}
                      {/* {quiz.myTeam?.id === team.id ? (
                        <button
                          onClick={() => leaveTeam(team)}
                          className={clsx('btn-sm btn', {
                            loading: isTeamUpdateLoading,
                            'btn-disabled': isTeamUpdateLoading,
                          })}
                        >
                          Leave
                        </button>
                      ) : (
                        !quiz.myTeam && (
                          <button
                            onClick={() => joinTeam(team)}
                            className={clsx('btn-secondary btn-sm btn', {
                              loading: isTeamUpdateLoading,
                              'btn-disabled':
                                isTeamUpdateLoading ||
                                team.members.length >= quiz.maxMembersPerTeam,
                            })}
                          >
                            Join
                          </button>
                        )
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isFormModalOpen && (
        <TeamFormModal
          team={editingTeam}
          onClose={() => {
            setEditingTeam(undefined);
            setIsFormModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
function checkIfTeamLeader(team: Team) {
  throw new Error('Function not implemented.');
}
