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
    body: [
      {
        message: `${new Date().toISOString()} ANSWERS [squiz game][${
          question.quizId
        }] question ${question.id}`,
        additionalProperties: {
          quizId: question.quizId,
          questionId: question.id,
          answers: JSON.stringify(question.answers),
        },
      },
    ],
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
