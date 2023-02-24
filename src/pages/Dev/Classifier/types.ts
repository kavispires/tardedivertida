import { ATTRIBUTES_KEYS } from './constants';

export type Attribute = typeof ATTRIBUTES_KEYS[number];

export type Weight = -5 | -3 | -1 | 0 | 1 | 3 | 5;

export type ItemId = string;

export type AlienItem = {
  id: ItemId;
  name: string;
  attributes: Record<Attribute, Weight>;
};

export type AlienItemDict = Record<ItemId, AlienItem>;
