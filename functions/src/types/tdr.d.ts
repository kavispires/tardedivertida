/**
 * Generic text card
 * Games that use: linhas-cruzadas, polemica-da-vez, single-word
 */
type TextCard = {
  id: CardId;
  text: string;
};

type ArteRuimCard = {
  id: CardId;
  text: string;
  level: number;
};

type ArteRuimGroup = {
  id: string;
  theme: string;
  cards: Record<CardId, string>;
};

type ArteRuimPair = {
  id: string;
  values: [string, string];
};

type ContenderCard = {
  id: CardId;
  name: DualLanguageValue;
  exclusivity?: Language;
};

type CrimeTile = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  values: DualLanguageValue[];
  type: string;
  specific?: string | null;
  tags?: Record<number | string, string[]>;
};

type GroupQuestionCard = {
  id: CardId;
  prefix: string;
  number: number;
  suffix: string;
};

type NamingPromptCard = {
  id: CardId;
  text: string;
  set: string;
  level: number;
};

type OpposingIdeaCard = {
  id: CardId;
  left: string;
  right: string;
};

type SpyLocation = {
  id: CardId;
  name: string;
  roles: string[];
};

type TestimonyQuestionCard = {
  id: CardId;
  question: string;
};

type ThemeCard = {
  id: CardId;
  text: string;
  description?: string;
};
