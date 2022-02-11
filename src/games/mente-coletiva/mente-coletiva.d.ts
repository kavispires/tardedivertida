type MQuestion = {
  id: string;
  number: number;
  prefix: string;
  suffix: string;
};

type MAnswer = {
  id: string;
  isLocked: boolean;
  playerId: PlayerId;
  answer: string;
  parsedAnswer: string;
};

type AllowedList = PlainObject;

type AnswerGroup = {
  answer: string;
  entries: MAnswer[];
  parsedAnswer: string;
};

type SubmitQuestionPayload = {
  questionId: string;
};

type SubmitAnswersPayload = {
  answers: string[];
  allowedList: PlainObject;
};

type AddAnswerPayload = {
  answer: MAnswer;
};

type NextAnswersPayload = {
  allowedList: string[];
};
