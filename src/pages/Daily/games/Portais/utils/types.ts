// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  guesses: string[][];
  currentCorridorIndex: number;
  currentCorridorIndexes: number[];
  moves: number[];
};

export type DailyPortaisEntry = {
  id: DateKey;
  setId: string;
  number: number;
  type: 'portais';
  goal: number;
  corridors: {
    passcode: string;
    imagesIds: string[];
    words: string[];
    goal: number;
  }[];
};
