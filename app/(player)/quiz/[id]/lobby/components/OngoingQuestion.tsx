'use client';
import 'client-only';
import { getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import { TailSpin } from 'react-loader-spinner';
import React, { useRef } from 'react';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import Timer, { getTimeLeft } from '~/shared/components/Timer';
import { storage } from '~/shared/lib/firebaseClient';
import { type Question } from '~/shared/types';

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
        <h2 className="mb-4 text-xl font-bold">
          Question {question.order}/{questionsCount}
        </h2>

        <div className="flex h-full w-full items-start">
          <div className="h-full w-3/6">
            <span className="text-xl">{question.text}</span>
            <div className="flex h-[80%] items-center justify-center">
              {question?.image &&
                (imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="question image"
                    width={300}
                    height={300}
                    loading="eager"
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
                ))}
            </div>
          </div>
          <div className="h-full w-3/6">
            <span className="text-lg">Your team answer:</span>
            <textarea
              className="textarea-bordered textarea h-[80%] w-full pb-6 text-lg"
              disabled={isSubmitting}
              name="answer"
              onChange={(event) => (answerRef.current = event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="italic">
          No worry, your team admin answer will be automatically sent at the end
          of the timer. <br />
          (for now other members answers are useless).
        </span>

        <Timer question={question} onDone={onTimerDone} />
      </div>
    </>
  );
}
