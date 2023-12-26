import { ATTRIBUTES } from './constants';

export type Attribute = keyof typeof ATTRIBUTES;

export type Weight = -5 | -3 | -1 | 0 | 1 | 3 | 5;

export type ItemId = string;

export type SignKey = string;

export type LegacyAlienItem = {
  id: ItemId;
  name: string;
  attributes: Record<Attribute, Weight>;
};

export type AlienItem = {
  id: ItemId;
  name: DualLanguageValue;
  attributes: Record<Attribute, Weight>;
  nsfw?: boolean;
  categories?: string[];
};

export type FirebaseAlienItem = {
  id: ItemId;
  name: DualLanguageValue;
  attributesStr: string;
  attributes?: Record<Attribute, Weight>;
  nsfw?: boolean;
  categories?: string[];
};

export type FirebaseAlienItemDict = Record<ItemId, FirebaseAlienItem>;

export type AlienItemDict = Record<ItemId, AlienItem>;

/**
 * Previously given sign with respective items
 */
export type AlienSignKnowledge = Record<SignKey, ItemId[]>;

export type InquiryScenario = {
  description: string;
  inquiry: ItemId[];
  attributes: Attribute[];
  knownAttributes: SignKey[];
  expected: Attribute;
};
