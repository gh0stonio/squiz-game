import clsx from 'clsx';
import React from 'react';

import type { Question } from '~/shared/types';

import { useQuiz } from '../hooks';

export default function Corrections() {
  const { currentQuestion, saveAnswersCorrection } = useQuiz();

  const [answers, setAnswers] = React.useState<Question['answers']>(
    currentQuestion?.answers || [],
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const submitCorrections = React.useCallback(async () => {
    setIsSubmitting(true);
    await saveAnswersCorrection(answers);
  }, [answers, saveAnswersCorrection]);

  if (!currentQuestion) return <span>This should not happen</span>;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative h-full w-full">
        <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col">
          <div className="-mx-4 overflow-auto px-4 pb-8">
            <div className="grid grid-cols-4 gap-4">
              {!answers || answers.length === 0 ? (
                <span>No answers yet</span>
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
          className={clsx('btn btn-secondary btn-sm w-36', {
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
