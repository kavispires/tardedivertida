import { DateKey } from 'pages/Daily/utils/types';
import { Item } from 'types/tdr';

export type DailyQuartetoEntry = {
  id: DateKey;
  number: number;
  type: 'quarteto';
  setId: string;
  itemsIds: string[];
  keys: {
    title: string;
    itemsIds: string[];
  }[]; // "id-id-id-id"
  items?: Dictionary<Item>;
};

export type QuartetoLocalToday = {
  id: DateKey;
  number: number;
  letters: string[];
};
