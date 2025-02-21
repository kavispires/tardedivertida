import type { DateKey } from 'pages/Daily/utils/types';

export type AquiOItem = {
  itemId: string;
  position: number;
  size: number;
  rotation: number;
  zIndex: number;
};

export type AquiODisc = {
  id: string;
  items: AquiOItem[];
  match?: string;
};

export type AquiOSet = {
  title: DualLanguageValue;
  itemsIds: string[];
};

export type DailyAquiOEntry = {
  id: DateKey;
  number: number;
  type: 'aqui-o';
  setId: string;
  title: DualLanguageValue;
  itemsIds: string[];
};

export type DailyAquiOGame = {
  cards: AquiODisc[];
} & DailyAquiOEntry;

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  goal: number;
  discs: AquiODisc[];
  attempts: number;
  maxProgress: number;
  hardMode: boolean;
};

export type SessionState = {
  discIndex: number;
};
