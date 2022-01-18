type SubmitQuestionPayload = {
  questionId: string;
};

type SubmitAnswersPayload = {
  answers: string[];
};

type AddAnswerPayload = {
  answer: string;
};

type NextAnswersPayload = {
  allowedList: string[];
};
