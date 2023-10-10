import { ATTRIBUTES } from './constants';

export type Attribute = keyof typeof ATTRIBUTES;

export type Weight = -5 | -3 | -1 | 0 | 1 | 3 | 5;

export type ItemId = string;

export type AlienItem = {
  id: ItemId;
  name: string;
  attributes: Record<Attribute, Weight>;
  nsfw?: boolean;
  categories?: string[];
};

export type AlienItemDict = Record<ItemId, AlienItem>;
