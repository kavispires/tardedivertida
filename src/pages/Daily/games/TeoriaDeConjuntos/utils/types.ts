import { DateKey } from 'pages/Daily/utils/types';

export type TThing = {
  id: string;
  name: string;
  rule?: number;
};

export type TRule = {
  id: string;
  text: string;
  level: number;
  thing: TThing;
};

export type DailyTeoriaDeConjuntosEntry = {
  id: DateKey;
  number: number;
  type: 'teoria-de-conjuntos';
  title: string;
  level: number;
  rule1: TRule;
  rule2: TRule;
  intersectingThing: TThing;
  things: TThing[];
};

export type Guess = { thingId: string; sectionId: number; result: number | false };

export type GameState = {
  hearts: number;
  win: boolean;
  hand: TThing[];
  deck: TThing[];
  rule1Things: TThing[];
  rule2Things: TThing[];
  intersectingThings: TThing[];
  activeThing: TThing | null;
  activeArea: null | number;
  guesses: Guess[];
};

export type TeoriaDeConjuntosLocalToday = {
  guesses: Guess[];
  hearts: number;
};
