import type { CardId, DualLanguageValue } from './types';

export type CrimesHediondosCard = {
  id: CardId;
  type: string;
  name: DualLanguageValue;
};

export type MonsterCard = {
  id: string;
  orientation: string;
};

export type SuspectCard = {
  id: CardId;
  pt: string;
  en: string;
  gender: string;
};
