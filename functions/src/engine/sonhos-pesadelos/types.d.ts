import { DefaultState, DefaultStore, ImageCard, Meta, Payload, PlayerId, Players } from '../../utils/types';

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
  players: Players;
  store: SonhosPesadelosStore;
  state: SonhosPesadelosState;
}

export interface TableEntry {
  cardId: ImageCard;
  dreamer: PlayerId | null;
  nightmares: PlayerId[];
}

export type Table = TableEntry[];

export type Result = {
  playerId: PlayerId;
  dreamGuesses: {
    [key: string]: boolean;
  };
  correct: number;
  nightmareHits: string[];
  win: boolean;
  previousScore: number;
};

export type Results = {
  [key: string]: Result;
};

export interface SonhosPesadelosSubmitAction extends Payload {
  action: 'SUBMIT_DREAMS' | 'SUBMIT_VOTING';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | SonhosPesadelosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | SonhosPesadelosStore;
