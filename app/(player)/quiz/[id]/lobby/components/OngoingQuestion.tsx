'use client';
import 'client-only';
import { getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import { FaQuestionCircle } from 'react-icons/fa';
import InnerImageZoom from 'react-inner-image-zoom';
import { TailSpin } from 'react-loader-spinner';
import React, { useRef } from 'react';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import Timer, { getTimeLeft } from '~/shared/components/Timer';
import { storage } from '~/shared/lib/firebaseClient';
import { type Question } from '~/shared/types';

import Logo from '../../../../../../public/logo.png';
import useTeam from '../../hooks/useTeam';

import Correction from './Correction';

interface OngoingQuestionProps {
  question: Question;
}

export default function OngoingQuestion({ question }: OngoingQuestionProps) {
  const { questionsCount, sendAnswer } = useQuiz();
  const { myTeam, checkIfLeader } = useTeam();

  const answerRef = useRef('');

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCorrecting, setIsCorrecting] = React.useState(
    getTimeLeft(question) === 0,
  );

  const onTimerDone = React.useCallback(async () => {
    setIsSubmitting(true);

    if (myTeam && checkIfLeader(myTeam)) {
      await sendAnswer(myTeam, answerRef.current);

      setIsCorrecting(true);
      setIsSubmitting(false);
    }
  }, [answerRef, checkIfLeader, myTeam, sendAnswer]);

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

  if (isCorrecting) return <Correction question={question} />;

  return (
    <>
      <div className="flex w-full flex-1 flex-col items-start justify-start">
        <div className="flex h-full w-full flex-col items-start justify-between">
          <div className="flex h-[68%] w-full flex-col items-start justify-start gap-4">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-1 gap-4 text-2xl">
                <div className="flex min-w-min gap-2">
                  <FaQuestionCircle className="h-8 w-8" />{' '}
                  <p>Question {question.order}: </p>
                </div>
                <h2 className="flex flex-1 gap-2 text-2xl font-bold">
                  {question.text}
                </h2>
              </div>
              <div className="flex w-60 items-start justify-end gap-3">
                <Timer question={question} onDone={onTimerDone} />
              </div>
            </div>

            <div className="relative flex h-full w-full items-center justify-center">
              {question?.image ? (
                imageUrl ? (
                  <InnerImageZoom
                    src={imageUrl}
                    zoomSrc={imageUrl}
                    className="absolute left-0 right-0 mx-auto h-full w-full [&>div>img]:absolute [&>div>img]:h-full [&>div]:flex [&>div]:h-full [&>div]:items-center [&>div]:justify-center"
                  />
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
                )
              ) : (
                <Image
                  src={Logo}
                  alt="logo"
                  height={220}
                  priority
                  className="opacity-5 grayscale"
                />
              )}
            </div>
          </div>
          <div className="h-[32%] w-full">
            <div className="flex w-full items-center justify-between">
              <span className="text-lg">Your team answer:</span>
              <h3 className="text-lg italic">
                Question {question.order} / {questionsCount} - Maximum Points:{' '}
                {question.maxPoints}
              </h3>
            </div>

            <textarea
              className="textarea-bordered textarea h-[70%] w-full resize-none pb-6 text-lg"
              disabled={isSubmitting}
              name="answer"
              onChange={(event) => (answerRef.current = event.target.value)}
            />
            <span className="italic">
              No worry, your team admin answer will be automatically sent at the
              end of the timer (for now other members answers are not used yet).
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
