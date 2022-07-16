import { CardId, DualLanguageValue } from './types';

/**
 * Generic text card
 * Games that use: linhas-cruzadas, polemica-da-vez, single-word
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

export type ArteRuimPair = {
  id: string;
  values: [string, string];
};

export type CrimeTile = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  values: DualLanguageValue[];
  type: string;
  specific?: string | null;
};

export type SpyLocation = {
  id: CardId;
  name: string;
  roles: string[];
};

export type GroupQuestionCard = {
  id: CardId;
  prefix: string;
  number: number;
  suffix: string;
};

export type OpposingIdeaCard = {
  id: CardId;
  left: string;
  right: string;
};

export type TestimonyQuestionCard = {
  id: CardId;
  question: string;
};

export type ThemeCard = {
  id: CardId;
  text: string;
  description?: string;
};

export type NamingPromptCard = {
  id: CardId;
  text: string;
  set: string;
  level: number;
};
