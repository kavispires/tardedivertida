import { DateKey } from 'pages/Daily/utils/types';

export type AquiOLocalToday = {
  id: DateKey;
  number: number;
  maxProgress: number;
  attempts: number;
  hardMode: boolean;
  hearts: number;
};

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
