export type AquiOItem = {
  itemId: string;
  position: number;
  size: number;
  rotation: number;
};

export type AquiODisc = {
  id: string;
  items: AquiOItem[];
};

export type AquiOSet = {
  title: DualLanguageValue;
  itemsIds: string[];
};

export type DailyAquiOEntry = {
  id: string;
  type: 'aqui-o';
  title: DualLanguageValue;
  itemsIds: string[];
};

export type DailyAquiOGame = {
  cards: AquiODisc[];
} & DailyAquiOEntry;
