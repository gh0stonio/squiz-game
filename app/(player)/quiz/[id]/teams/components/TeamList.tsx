'use client';
import 'client-only';
import clsx from 'clsx';
import Image from 'next/image';
import { HiOutlineUser } from 'react-icons/hi';
import React from 'react';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import useTeam from '~/(player)/quiz/[id]/hooks/useTeam';
import { Team } from '~/shared/types';

import TeamFormModal from './TeamFormModal';

export default function TeamList() {
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [editingTeam, setEditingTeam] = React.useState<Team>();

  const { quiz } = useQuiz();
  const { teams, myTeam, isChangeOngoing, checkIfLeader, joinTeam, leaveTeam } =
    useTeam();

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-end">
          <button
            type="button"
            className={clsx('btn btn-accent btn-sm mb-6', {
              'btn-disabled': quiz.status === 'in progress' || !!myTeam,
            })}
            onClick={() => setIsFormModalOpen(true)}
          >
            Create Team
          </button>
        </div>

        <div className="-mx-4 overflow-auto px-4 pb-8">
          {!teams || teams.length === 0 ? (
            <p className="flex w-full items-center justify-center text-2xl">
              No team available yet
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="h-70 card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title flex w-full items-center justify-between">
                      <p>{team.name}</p>
                      <p className="flex items-center justify-end">
                        {team.members.length} / {quiz.maxMembersPerTeam}
                      </p>
                    </h2>
                    <div className="h-32">
                      <div className="flex flex-col">
                        <p className="italic">Admin:</p>
                        <div className="flex pb-2">
                          <div className="tooltip" data-tip={team.leader.name}>
                            {team.leader?.photoURL ? (
                              <Image
                                src={team.leader.photoURL!}
                                alt="member photo"
                                width={40}
                                height={40}
                                priority
                                className="w-10 rounded-full"
                              />
                            ) : (
                              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-200">
                                <HiOutlineUser className="h-6 w-6 text-gray-600" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="italic">Members:</p>
                        <div className="flex gap-2">
                          {team.members
                            .filter((member) => member.uid !== team.leader.uid)
                            .map((member) => {
                              return (
                                <div
                                  className="tooltip"
                                  data-tip={member.name}
                                  key={member.uid}
                                >
                                  {member?.photoURL ? (
                                    <Image
                                      src={member.photoURL!}
                                      alt="member photo"
                                      width={40}
                                      height={40}
                                      priority
                                      className="w-10 rounded-full"
                                    />
                                  ) : (
                                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-200">
                                      <HiOutlineUser className="h-6 w-6 text-gray-600" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="card-actions flex justify-end">
                      {checkIfLeader(team) && (
                        <button
                          onClick={() => {
                            setEditingTeam(team);
                            setIsFormModalOpen(true);
                          }}
                          className={clsx('btn btn-secondary btn-sm', {
                            loading: isChangeOngoing,
                          })}
                        >
                          Admin
                        </button>
                      )}
                      {myTeam?.id === team.id && !checkIfLeader(team) ? (
                        <button
                          onClick={() => leaveTeam(team)}
                          className={clsx('btn btn-sm', {
                            loading: isChangeOngoing,
                            'btn-disabled': isChangeOngoing,
                          })}
                        >
                          Leave
                        </button>
                      ) : (
                        !myTeam && (
                          <button
                            onClick={() => joinTeam(team)}
                            className={clsx('btn btn-secondary btn-sm', {
                              loading: isChangeOngoing,
                              'btn-disabled':
                                isChangeOngoing ||
                                team.members.length >= quiz.maxMembersPerTeam,
                            })}
                          >
                            Join
                          </button>
                        )
                      )}
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
