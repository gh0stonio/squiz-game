import { client, v2 } from '@datadog/datadog-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Question } from '~/shared/types';

function sendResultsHandler(req: NextApiRequest, res: NextApiResponse) {
  const configuration = client.createConfiguration({
    authMethods: {
      apiKeyAuth: process.env.DD_API_KEY,
      appKeyAuth: process.env.DD_APPLICATION_KEY,
    },
  });
  const apiInstance = new v2.LogsApi(configuration);

  const question = req.body as Question;
  const params: v2.LogsApiSubmitLogRequest = {
    body: (question.answers || []).map((answer) => ({
      message: `${new Date().toISOString()} ANSWERS [squiz game] quiz="${
        question.quizId
      }" question="${question.id}" questionNumber="${question.order}" team="${
        answer.team
      }" score="${answer.score}"`,
      additionalProperties: {
        quizId: question.quizId,
        questionId: question.id,
        team: answer.team,
        answer: answer.value,
        score: (answer.score || 0).toString(),
      },
    })),
    contentEncoding: 'deflate',
  };

  apiInstance
    .submitLog(params)
    .then((data: any) => {
      res.status(200).json(question);
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500);
    });
}

export default sendResultsHandler;
