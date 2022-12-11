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
        <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col pt-8">
          <div className="overflow-auto rounded-lg">
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
              <table className="table w-full">
                <thead className="sticky top-0">
                  <tr className="h-12 [&>th]:bg-gray-200">
                    <th className="w-1/5">Team</th>
                    <th className="w-3/5">Answer</th>
                    <th className="w-1/5">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((answer, index) => {
                    return (
                      <tr key={index} className="h-12">
                        <td>{answer.team}</td>
                        <td className="whitespace-pre-wrap">{answer.value}</td>
                        <td>
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
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
      </div>
    </div>
  );
}
