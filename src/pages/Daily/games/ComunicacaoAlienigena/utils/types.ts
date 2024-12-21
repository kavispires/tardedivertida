import type { DateKey } from 'pages/Daily/utils/types';

type DailyAlienGameAttribute = {
  id: string;
  name: string;
  description: string;
  spriteId: string;
  itemsIds: string[];
};

type DailyAlienGameRequest = {
  spritesIds: string[];
  itemId: string;
};

export type GameState = {
  hearts: number;
  guesses: string[];
  selection: (string | null)[];
  slotIndex: number | null;
  latestAttempt: number | null;
  win: boolean;
};

export type DailyComunicacaoAlienigenaEntry = {
  id: DateKey;
  setId: string;
  number: number;
  type: 'comunicação-alienígena';
  attributes: DailyAlienGameAttribute[];
  requests: DailyAlienGameRequest[];
  solution: string;
  itemsIds: string[];
  valid: boolean;
};

export type ComunicacaoAlienigenaLocalToday = {
  id: DateKey;
  number: number;
  guesses: string[];
};
