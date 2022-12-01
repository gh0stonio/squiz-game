'use client';
import 'client-only';
import clsx from 'clsx';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TailSpin } from 'react-loader-spinner';
import React from 'react';
import { uid } from 'uid';

import { storage } from '~/shared/lib/firebaseClient';
import type { Question } from '~/shared/types';

import { useQuestions, useQuiz } from '../hooks';

export type QuestionFormInputs = Pick<
  Question,
  'text' | 'answer' | 'duration' | 'maxPoints'
> & { files?: FileList };
type QuestionFormProps = {
  onClose: () => void;
  question?: Question;
};

export default function QuestionFormModal({
  onClose,
  question,
}: QuestionFormProps) {
  const { quiz } = useQuiz();
  const { questions, addQuestion, editQuestion } = useQuestions();
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

  const [imageUrl, setImageUrl] = React.useState<string>();
  React.useEffect(() => {
    async function fetchingUrl(imageName: string) {
      const imageRef = ref(storage, imageName);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    }
    if (!question?.image) {
      return;
    }

    fetchingUrl(question.image);
  }, [question?.image]);

  const onSubmitForm: SubmitHandler<QuestionFormInputs> = async (data) => {
    if (!quiz?.id) return;

    setIsSubmitting(true);

    const files = data.files;
    delete data.files;

    const savingQuestion: Question = isEdit
      ? { ...question, ...data, quizId: quiz.id, updatedAt: Date.now() }
      : {
          id: uid(16),
          quizId: quiz.id,
          order: questions.length + 1,
          status: 'ready',
          createdAt: Date.now(),
          ...data,
        };

    if (files && files.length > 0) {
      const imageName = files && files[0].name;
      const imageRef = ref(storage, imageName);
      await uploadBytes(imageRef, files[0]);
      savingQuestion.image = imageName;
    }

    await (isEdit ? editQuestion(savingQuestion) : addQuestion(savingQuestion));

    reset();
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
              className={clsx('h-30 textarea-bordered textarea', {
                'textarea-error': !!errors.text,
              })}
              {...register('text', { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Image</span>
            </label>
            <div className="flex w-full gap-12">
              <input
                type="file"
                className="file-input-bordered file-input w-full max-w-xs"
                {...register('files', { required: false })}
              />

              {question?.image &&
                (imageUrl ? (
                  <div className="flex items-center justify-center rounded">
                    <p>Current image:</p>
                    <Image
                      src={imageUrl}
                      alt="question image"
                      width={50}
                      height={50}
                    />
                  </div>
                ) : (
                  <TailSpin
                    height="30"
                    width="30"
                    color="#4fa94d"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ))}
            </div>
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
              <span className="label-text text-lg">
                Duration (in seconds) *
              </span>
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
              <button
                type="submit"
                onClick={handleSubmit(onSubmitForm)}
                className="btn-accent btn-sm btn"
              >
                {question ? 'Update' : 'Create'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('question-form-modal')!,
  );
}
