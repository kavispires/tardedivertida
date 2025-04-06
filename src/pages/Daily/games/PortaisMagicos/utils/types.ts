import type { DateKey } from 'pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  guesses: string[][];
  currentCorridorIndex: number;
  currentCorridorIndexes: number[];
  moves: number;
};

export type DailyPortaisMagicosEntry = {
  id: DateKey;
  setId: string;
  number: number;
  type: 'portais-magicos';
  corridors: {
    passcode: string;
    imagesIds: string[];
    words: string[];
  }[];
};
