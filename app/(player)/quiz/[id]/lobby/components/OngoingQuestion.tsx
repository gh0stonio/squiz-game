'use client';
import 'client-only';
import { intervalToDuration } from 'date-fns';
import { getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import { TailSpin } from 'react-loader-spinner';
import React from 'react';

import useQuiz from '~/(player)/quiz/[id]/hooks/useQuiz';
import { useTimer } from '~/shared/hooks/useTimer';
import { storage } from '~/shared/lib/firebaseClient';
import { type Question } from '~/shared/types';

import useTeam from '../../hooks/useTeam';

interface OngoingQuestionProps {
  question: Question;
}

export default function OngoingQuestion({ question }: OngoingQuestionProps) {
  const { questionsCount, sendAnswer } = useQuiz();
  const { myTeam } = useTeam();
  const timer = useTimer(question);
  const duration = timer.timeLeft
    ? intervalToDuration({
        start: 0,
        end: timer.timeLeft * 1000,
      })
    : undefined;

  const [answer, setAnswer] = React.useState('');
  React.useEffect(() => {
    if (myTeam && timer.isExpired) {
      sendAnswer(myTeam, answer);
    }
  }, [answer, myTeam, sendAnswer, timer.isExpired]);

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
              name="answer"
              onChange={(event) => setAnswer(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="italic">
          No worry, your answer will be automatically sent at the end of the
          timer.
        </span>
        <span>
          Time left:{' '}
          <span className="countdown font-mono font-semibold">
            {/* 
                // @ts-ignore */}
            <span style={{ '--value': duration?.minutes || 0 }}></span>:
            {/* 
                // @ts-ignore */}
            <span style={{ '--value': duration?.seconds }}></span>
          </span>
        </span>
      </div>
    </>
  );
}
