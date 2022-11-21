'use client';
import 'client-only';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import { uid } from 'uid';

import useQuiz from '~/admin/hooks/useQuiz';
import type { Question } from '~/shared/types';

export type QuestionFormInputs = Pick<
  Question,
  'text' | 'answer' | 'duration' | 'maxPoints'
>;
type QuestionFormProps = {
  onClose: () => void;
  question?: Question;
};

export default function QuestionFormModal({
  onClose,
  question,
}: QuestionFormProps) {
  const { editQuestion, addQuestion } = useQuiz();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEdit = !!question;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuestionFormInputs>({ defaultValues: { ...question } });

  const closeModal = React.useCallback(() => {
    reset();
    setIsSubmitting(false);
    onClose();
  }, [onClose, reset]);

  const onSubmitForm: SubmitHandler<QuestionFormInputs> = async (data) => {
    const updatedQuestion: Question = isEdit
      ? { ...question, ...data, updatedAt: Date.now() }
      : {
          id: uid(16),
          status: 'ready',
          createdAt: Date.now(),
          ...data,
        };

    isEdit ? editQuestion(updatedQuestion) : addQuestion(updatedQuestion);

    reset();
    setIsSubmitting(true);
    closeModal();
  };

  return createPortal(
    <div className={'modal modal-open'}>
      <div className="modal-box w-10/12 max-w-4xl">
        <h3 className="pb-4 text-lg font-bold">Add new question</h3>

        <form>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Text*</span>
              {errors.text && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <textarea
              className={clsx('textarea-bordered textarea h-60', {
                'textarea-error': !!errors.text,
              })}
              {...register('text', { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Answer*</span>
              {errors.answer && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <textarea
              className={clsx('textarea-bordered textarea', {
                'textarea-error': !!errors.answer,
              })}
              {...register('answer', { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Duration*</span>
              {errors.duration && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              className={clsx('input-bordered input', {
                'input-error': !!errors.duration,
              })}
              {...register('duration', { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Max points*</span>
              {errors.maxPoints && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              className={clsx('input-bordered input', {
                'input-error': !!errors.maxPoints,
              })}
              {...register('maxPoints', { required: true })}
            />
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button className="btn-sm btn" onClick={closeModal}>
              Cancel
            </button>
            {isSubmitting ? (
              <button className="btn-disabled loading btn-square btn-sm btn" />
            ) : (
              <input
                type="submit"
                onClick={handleSubmit(onSubmitForm)}
                className="btn-accent btn-sm btn"
              />
            )}
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('question-form-modal')!,
  );
}
