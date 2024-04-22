export type DateKey = string; // Format YYYY-MM-DD

export type DailyArteRuimEntry = {
  id: DateKey;
  number: number;
  type: 'arte-ruim';
  language: Language;
  cardId: CardId;
  text: string;
  drawings: string[];
  dataIds: string[];
};

export type DailyResponse = {
  data: DailyArteRuimEntry;
};

export type ArteRuimLocalToday = {
  id: string;
  number: number;
  victory: boolean;
  hearts: number;
  letters: string[];
};

export type AcheIssoItem = {
  itemId: string;
  position: number;
  size: number;
  rotation: number;
};

export type AcheIssoDisc = {
  id: string;
  items: AcheIssoItem[];
};

export type DailyAcheIssoEntry = {
  itemIds: string[];
  cards: AcheIssoDisc[];
  title: DualLanguageValue;
};

export type AcheIssoSet = {
  title: DualLanguageValue;
  itemsIds: string[];
};
