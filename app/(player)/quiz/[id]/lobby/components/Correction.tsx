'use client';
import 'client-only';
import React from 'react';

import { type Question } from '~/shared/types';

interface CorrectionProps {
  question: Question;
}

export default function Correction({ question }: CorrectionProps) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="text-xl">
        The quiz master is currently correcting, please wait for next question !
      </h3>

      <p className="italic">
        In the mean time feel free to look at all the teams answers.
      </p>

      <div className="relative h-full w-full">
        <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col">
          <div className="-mx-4 overflow-auto px-4 py-8">
            <div className="grid grid-cols-4 gap-4">
              {!question.answers || question.answers.length === 0 ? (
                <span>No answers yet</span>
              ) : (
                question.answers.map((answer, index) => (
                  <div key={index} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title flex w-full items-center justify-between">
                        <p>Team: {answer.team}</p>
                      </h2>
                      <p className="max-h-36 overflow-auto">
                        Answer: {answer.value}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
