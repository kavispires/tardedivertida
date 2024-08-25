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

export type TeoriaDeConjuntosLocalToday = {};
