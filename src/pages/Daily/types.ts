export type DateKey = string; // Format YYYY-MM-DD

export type DailyEntry = {
  id: DateKey;
  number: number;
  type: string;
  language: Language;
  cardId: CardId;
  text: string;
  drawings: string[];
  dataIds: string[];
};
