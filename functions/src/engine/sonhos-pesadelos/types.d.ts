import type { NamingPromptCard } from '../../types/tdr';
import type { SONHOS_PESADELOS_ACTIONS } from './constants';

export interface ResourceData {
  cards: SonhosPesadelosCards;
  images: ImageCardId[];
}

export type SonhosPesadelosCards = {
  2: NamingPromptCard[];
  3: NamingPromptCard[];
  4: NamingPromptCard[];
};

export type ThemeDeck = {
  1: NamingPromptCard[];
  2: NamingPromptCard[];
  3: NamingPromptCard[];
  4: NamingPromptCard[];
  5: NamingPromptCard[];
};

export interface SonhosPesadelosStore extends DefaultStore {
  themes?: any;
  results?: any;
  [key: string]: any;
}

export interface SonhosPesadelosState extends DefaultState {
  table?: any;
  dreamsCount?: number;
  nightmaresCount?: number;
  theme?: any;
  clues?: any;
  results?: any;
  isLastChance?: boolean;
  winners?: any;
  [key: string]: any;
}

export interface SonhosPesadelosInitialState {
  meta: Meta;
  store: SonhosPesadelosStore;
  state: SonhosPesadelosState;
}

export interface TableEntry {
  cardId: ImageCardId;
  dreamer: PlayerId | null;
  nightmares: PlayerId[];
}

export type Table = TableEntry[];

export type Result = {
  playerId: PlayerId;
  dreamId: ImageCardId;
  dream: string;
  cards: {
    cardId: ImageCardId;
    votes: PlayerId[];
    isDream: boolean;
    isNightmare: boolean;
  }[];
};

export interface SonhosPesadelosSubmitAction extends Payload {
  action: keyof typeof SONHOS_PESADELOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | SonhosPesadelosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | SonhosPesadelosStore;
