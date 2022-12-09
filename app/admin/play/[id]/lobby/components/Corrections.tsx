import clsx from 'clsx';
import { onSnapshot, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { TailSpin } from 'react-loader-spinner';
import React from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question } from '~/shared/types';

import { useQuiz } from '../hooks';

export default function Corrections() {
  const router = useRouter();
  const { quiz, currentQuestion, saveAnswersCorrection } = useQuiz();

  const [answers, setAnswers] = React.useState<Question['answers']>(
    currentQuestion?.answers || [],
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const submitCorrections = React.useCallback(async () => {
    setIsSubmitting(true);
    await saveAnswersCorrection(answers);

    router.refresh();
  }, [answers, router, saveAnswersCorrection]);

  // Listening for answers changes (useful for answers update)
  React.useEffect(() => {
    if (!currentQuestion) return;

    const unsubscribe = onSnapshot(
      doc(db, 'questions', currentQuestion.id).withConverter(
        genericConverter<Question>(),
      ),
      (doc) => {
        console.log(doc);
        setAnswers(doc.data()?.answers);
      },
    );

    return unsubscribe;
  }, [currentQuestion, quiz]);

  if (!currentQuestion) return <span>This should not happen</span>;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative h-full w-full">
        <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col">
          <div className="-mx-4 overflow-auto px-4 pb-8">
            <div className="grid grid-cols-4 gap-4">
              {!answers || answers.length === 0 ? (
                <>
                  <span>No answers yet, getting them ...</span>
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
                </>
              ) : (
                answers.map((answer, index) => (
                  <div key={index} className="card h-40 bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title flex w-full items-center justify-between">
                        <p>Team: {answer.team}</p>
                      </h2>
                      <p>Answer: {answer.value}</p>
                      <div className="card-actions flex justify-end pt-4">
                        <select
                          className="select-bordered select select-sm w-32"
                          onChange={(event) => {
                            setAnswers((_answers) =>
                              _answers?.map((_answer) =>
                                _answer.team === answer.team
                                  ? {
                                      ..._answer,
                                      score: parseInt(event.target.value, 10),
                                    }
                                  : _answer,
                              ),
                            );
                          }}
                        >
                          <option disabled selected>
                            Score
                          </option>
                          {[...Array(currentQuestion.maxPoints + 1)].map(
                            (x, i) => (
                              <option key={i}>{i}</option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center pt-4">
        <button
          className={clsx('btn-secondary btn-sm btn w-36', {
            'btn-disabled': isSubmitting,
            loading: isSubmitting,
          })}
          onClick={submitCorrections}
        >
          Save
        </button>
      </div>
    </div>
  );
}
