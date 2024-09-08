import { DailyGameStatus, DateKey, LettersDictionary } from 'pages/Daily/utils/types';

export type GameState = {
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
  year: number;
};

export type FilmacoLocalToday = {
  id: DateKey;
  number: number;
  letters: string[];
  status?: DailyGameStatus;
};
