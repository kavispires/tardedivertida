// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export interface Kid {
  id: number;
  cardId: string;
  name: DualLanguageValue;
  gender: Gender;
  height: number;
  color: string;
}

export type Gender = 'boy' | 'girl';
export interface GeneratedKid extends Kid {
  statement: DualLanguageValue;
}

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  guesses: string[];
  assessments: Record<string, 'culprit' | 'liar' | 'innocent'>; // Map of kid ID to assessment
};

export type DailyPirralhosEntry = {
  id: DateKey;
  number: number;
  type: 'pirralhos';
  kids: GeneratedKid[];
  culpritsIds: UID[];
  liarsIds: UID[];
  possibleLiars: number;
  difficulty: number; // The calculated 1-100 difficulty score
};
