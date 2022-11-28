'use client';
import 'client-only';
import clsx from 'clsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';

import useQuiz from '~/admin/shared/hooks/useQuiz';
import { Quiz } from '~/shared/types';

import QuestionList from './QuestionList';

type QuizFormProps = {};
type QuizFormInputs = Pick<Quiz, 'name' | 'description' | 'maxMembersPerTeam'>;

export default function QuizForm({}: QuizFormProps) {
  const { quiz, saveQuiz } = useQuiz();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormInputs>({ defaultValues: quiz });

  const onSubmit: SubmitHandler<QuizFormInputs> = async (data) => {
    setIsSubmitting(true);

    saveQuiz(data).then(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <form className="flex flex-1 flex-col">
      <div className="flex h-full flex-col items-stretch">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="form-control w-9/12">
            <label className="label">
              <span className="label-text text-lg font-semibold">Label*</span>
              {errors.name && (
                <span className="label-text-alt">This field is required</span>
              )}
            </label>
            <input
              type="text"
              defaultValue={quiz?.name}
              className={clsx('input-bordered input', {
                'input-error': !!errors.name,
              })}
              {...register('name', { required: true })}
            />
          </div>

          <div className="form-control w-3/12">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                Members per team*
              </span>
              {errors.maxMembersPerTeam && (
                <span className="label-text-alt">This field is required</span>
              )}
            </label>
            <input
              type="number"
              max={10}
              defaultValue={quiz?.maxMembersPerTeam}
              className={clsx('input-bordered input', {
                'input-error': !!errors.maxMembersPerTeam,
              })}
              {...register('maxMembersPerTeam', { required: true })}
            />
          </div>
        </div>

        <div className="w-12/12 form-control pt-2">
          <label className="label">
            <span className="label-text text-lg font-semibold">
              Description*
            </span>
            {errors.description && (
              <span className="label-text-alt">This field is required</span>
            )}
          </label>
          <input
            type="text"
            defaultValue={quiz?.description}
            className={clsx('input-bordered input', {
              'input-error': !!errors.description,
            })}
            {...register('description', { required: true })}
          />
        </div>

        <QuestionList />

        <div className="flex items-center justify-between pt-10">
          {isSubmitting ? (
            <button className="btn-disabled loading btn-square btn-sm btn" />
          ) : (
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="btn-secondary btn-sm btn"
            >
              {quiz ? 'Update' : 'Create'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
