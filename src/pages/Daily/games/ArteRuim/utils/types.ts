// Pages
import type { DateKey, LettersDictionary } from '@pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  solution: Dictionary<boolean>;
  guesses: LettersDictionary;
};

export type DailyArteRuimEntry = {
  id: DateKey;
  number: number;
  type: 'arte-ruim';
  language: Language;
  cardId: UID;
  text: string;
  drawings: string[];
  dataIds: string[];
};
