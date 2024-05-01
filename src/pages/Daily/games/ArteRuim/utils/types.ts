import { DateKey } from 'pages/Daily/utils/types';

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

export type ArteRuimLocalToday = {
  id: DateKey;
  number: number;
  letters: string[];
};
