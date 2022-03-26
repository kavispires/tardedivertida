import { CardId, DualLanguageValue } from './types';

/**
 * Generic text card
 * Games that use: linhas-cruzadas, polemica-da-vez, single-word, ue-so-isso
 */
export type TextCard = {
  id: CardId;
  text: string;
};

export type ArteRuimCard = {
  id: CardId;
  text: string;
  level: number;
};

export type ArteRuimGroup = {
  id: string;
  theme: string;
  cards: Record<CardId, string>;
};

export type CrimesHediondosSceneTile = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  values: DualLanguageValue[];
  type: string;
  specific?: string | null;
};

export type EspiaoEntreNosLocation = {
  id: CardId;
  name: string;
  roles: string[];
};

export type MenteColetivaCard = {
  id: CardId;
  prefix: string;
  number: number;
  suffix: string;
};

export type OndaTelepaticaCard = {
  id: CardId;
  left: string;
  right: string;
};

export type TestemunhaOcularCard = {
  id: CardId;
  question: string;
};

export type ThemeCard = {
  id: CardId;
  text: string;
  description?: string;
};
