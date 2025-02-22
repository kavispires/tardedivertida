import type { DateKey } from 'pages/Daily/utils/types';

type TaNaCaraQuestion = {
  testimonyId: string;
  question: string;
  nsfw?: boolean;
  suspectsIds: string[];
};

export type GameState = {
  id: DateKey;
  number: number;
  played: boolean;
};

export type SessionState = {
  testimonies: TaNaCaraQuestion[];
  answers: AnswerToSave[];
  selections: string[];
  questionIndex: number;
  allowNSFW: boolean;
  screen: 'idle' | 'playing' | 'saving';
};

export type DailyTaNaCaraEntry = {
  id: DateKey;
  number: number;
  type: 'ta-na-cara';
  testimonies: TaNaCaraQuestion[];
};

export type AnswerToSave = {
  testimonyId: string;
  related: string[];
  unrelated: string[];
};
