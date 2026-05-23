// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type Gender = 'boy' | 'girl';
export interface Kid {
  id: UID;
  cardId: string;
  name: DualLanguageValue;
  gender: Gender;
  height: number;
  color: string;
}

export interface GeneratedKid {
  kidId: UID;
  statement: DualLanguageValue;
}

export type KidAssessment = 'culprit' | 'liar' | 'innocent' | 'unknown';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  guesses: string[];
  assessments: Record<string, KidAssessment>; // Map of kid ID to assessment
};

export type DailyPirralhosEntry = {
  id: DateKey;
  number: number;
  type: 'pirralhos';
  hashId: string;
  kids: GeneratedKid[];
  culpritId: UID;
  liarsIds: UID[];
  possibleLiars: number;
  difficulty: number; // The calculated 1-100 difficulty score
};
