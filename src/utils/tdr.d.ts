/**
 * Generic text card
 * Games that use: linhas-cruzadas, single-word
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
  groups?: string[];
  nsfw?: boolean;
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
  answer: string;
  nsfw?: boolean;
};

type ThemeCard = {
  id: CardId;
  text: string;
  description?: string;
};

type Tweet = {
  id: CardId;
  text: string;
  custom?: boolean;
};

type TopicCard = {
  id: CardId;
  label: string;
  category: string;
  level: number;
};

type DatingCandidateCard = {
  id: CardId;
  text: string;
  type: 'fun-fact' | 'interest' | 'need';
};

type DatingCandidateImageCard = {
  id: CardId;
  name: DualLanguageValue;
  type: 'head' | 'body';
};

type DilemmaCard = {
  id: CardId;
  prompt: string;
  left: string;
  right: string;
  nsfw?: boolean;
};

type QuantitativeQuestionCard = {
  id: CardId;
  question: string;
  scale?: boolean;
};

type MovieCard = {
  id: CardId;
  prefix: string;
  suffix: string;
};

type MovieReviewCard = {
  id: CardId;
  text: string;
  type: 'good' | 'bad';
  highlights?: string[];
};

type AlienItem = {
  id: string;
  name: DualLanguageValue;
  attributes: Record<string, -5 | -3 | -1 | 0 | 1 | 3 | 5>;
  nsfw?: boolean;
  categories?: string[];
};