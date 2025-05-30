import type { DateKey } from 'pages/Daily/utils/types';

export type TaNaCaraQuestion = {
  testimonyId: string;
  question: string;
  nsfw?: boolean;
  suspectsIds?: string[];
};

export type GameState = {
  id: DateKey;
  number: number;
  played: boolean;
  suspectsIds?: string[];
};

export type SessionState = {
  testimonies: TaNaCaraQuestion[];
  suspectsIds: string[][];
  answers: AnswerToSave[];
  selections: string[];
  questionIndex: number;
  mode: 'normal' | 'nsfw';
  screen: 'idle' | 'playing' | 'saving';
};

export type DailyTaNaCaraEntry = {
  id: DateKey;
  number: number;
  type: 'ta-na-cara';
  testimonies: TaNaCaraQuestion[];
  suspectsIds: string[];
};

export type AnswerToSave = {
  testimonyId: string;
  related: string[];
  unrelated: string[];
};
