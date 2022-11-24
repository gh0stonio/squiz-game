'use client';
import 'client-only';
import React from 'react';

import { type Question } from '~/shared/types';

interface CorrectionProps {
  question: Question;
}

export default function Correction({ question }: CorrectionProps) {
  return (
    <div className="flex flex-col">
      <h3 className="text-xl">
        The quiz master is currently correcting, please wait for next question !
      </h3>

      <p className="italic">
        In the mean time feel free to look at all the teams answers.
      </p>
    </div>
  );
}
