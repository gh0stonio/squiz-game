'use client';
import 'client-only';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaUserLock } from 'react-icons/fa';
import { TiUserDelete } from 'react-icons/ti';
import React from 'react';

import useTeam from '~/(player)/quiz/[id]/hooks/useTeam';
import type { Team } from '~/shared/types';

export type TeamFormInputs = Pick<Team, 'name'>;
type TeamFormProps = {
  onClose: (question?: Team) => void;
  team?: Team;
};

export default function TeamFormModal({ onClose, team }: TeamFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    isChangeOngoing,
    checkIfLeader,
    createTeam,
    editTeam,
    deleteTeam,
    kickPlayer,
    delegateLead,
  } = useTeam();

  const isEdit = !!team;
  const isTeamLeaderEditing = isEdit && checkIfLeader(team);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormInputs>({ defaultValues: { ...team } });

  const closeModal = React.useCallback(() => {
    reset();
    setIsSubmitting(false);
    onClose();
  }, [onClose, reset]);

  const onSubmit: SubmitHandler<TeamFormInputs> = async (data) => {
    setIsSubmitting(true);

    (isEdit
      ? editTeam({ ...team, name: data.name })
      : createTeam(data.name)
    )?.then(() => {
      reset();
      closeModal();
    });
  };

  const membersWithoutLeader = React.useMemo(
    () =>
      team
        ? team.members.filter((member) => member.uid !== team.leader.uid)
        : [],
    [team],
  );

  return createPortal(
    <div className={'modal modal-open'}>
      <div
        className={clsx('modal-box', {
          'w-8/12 max-w-3xl': isTeamLeaderEditing,
        })}
      >
        <h3 className="pb-4 text-lg font-bold">
          {isTeamLeaderEditing ? 'Admin' : 'Create new team'}
        </h3>

        <form>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Name*</span>
              {errors.name && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <input
              className={clsx('input-bordered input', {
                'input-error': !!errors.name,
              })}
              {...register('name', { required: true })}
            />
          </div>

          {isTeamLeaderEditing && (
            <div className="overflow-x-auto py-8">
              <table className="table-compact table w-full">
                <thead>
                  <tr className="h-8 [&>th]:bg-gray-400">
                    <th className="w-10/12" style={{ zIndex: 0 }}>
                      Name
                    </th>
                    <th className="w-2/12 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {membersWithoutLeader.length === 0 ? (
                    <tr className="h-8 [&>td]:bg-gray-200">
                      <td colSpan={2}>
                        <span className="flex w-full items-center justify-center">
                          No other member
                        </span>
                      </td>
                    </tr>
                  ) : (
                    membersWithoutLeader.map((member) => (
                      <tr key={member.uid} className="h-8 [&>td]:bg-gray-200">
                        <td>{member.name}</td>
                        <td>
                          <div className="flex justify-center">
                            <div className="tooltip" data-tip="Delegate admin">
                              <FaUserLock
                                className="h-8 w-8 cursor-pointer pr-2 text-gray-400"
                                onClick={() =>
                                  delegateLead(team, member)?.then(() =>
                                    closeModal(),
                                  )
                                }
                              />
                            </div>
                            <div className="tooltip" data-tip="Kick user">
                              <TiUserDelete
                                className="h-8 w-8 cursor-pointer pr-2 text-gray-400"
                                onClick={() => kickPlayer(team, member)}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <button
              className="btn-sm btn"
              type="button"
              onClick={() => closeModal()}
            >
              Cancel
            </button>
            {isSubmitting || isChangeOngoing ? (
              <button
                className="btn-disabled loading btn-square btn-sm btn"
                type="button"
              />
            ) : (
              <div className="flex gap-4">
                {isTeamLeaderEditing && (
                  <button
                    type="button"
                    onClick={() => deleteTeam(team)?.then(() => closeModal())}
                    className="btn-secondary btn-sm btn"
                  >
                    Delete
                  </button>
                )}
                <input
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="btn-accent btn-sm btn"
                />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('team-form-modal')!,
  );
}
