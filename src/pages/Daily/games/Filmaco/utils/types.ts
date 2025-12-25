// Pages
import type { DateKey, LettersDictionary } from 'pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  solution: BooleanDictionary;
  guesses: LettersDictionary;
};

export type DailyFilmacoEntry = {
  id: DateKey;
  number: number;
  type: 'filmaco';
  setId: string;
  title: string;
  itemsIds: string[];
  year: number | string;
  isDoubleFeature?: boolean;
};
