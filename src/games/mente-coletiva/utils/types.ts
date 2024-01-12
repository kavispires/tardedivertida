import { GroupQuestionCard } from 'types/tdr';

export type Question = {
  id: string;
  number: number;
  prefix: string;
  suffix: string;
};

export type Answer = {
  id: string;
  isLocked: boolean;
  playerId: PlayerId;
  answer: string;
  parsedAnswer: string;
};

export type AllowedList = PlainObject;

export type AnswerGroupObject = {
  answer: string;
  entries: Answer[];
  parsedAnswer: string;
};

export type SubmitQuestionPayload = {
  questionId: string;
};

export type SubmitCustomQuestionPayload = {
  question: Question;
};

export type SubmitAnswersPayload = {
  answers: string[];
  allowedList: PlainObject;
};

export type AddAnswerPayload = {
  answer: Answer;
};

export type NextAnswersPayload = {
  allowedList: string[];
};

export type GalleryEntry = {
  question: GroupQuestionCard;
  answers: {
    playerIds: PlayerId[];
    answer: string;
  }[];
};
