import { ImageCard, Language, Meta, Payload, PlayerId, Players, Round } from '../../utils/interfaces';

export interface SonhosPesadelosStore {
  language: Language;
  deck: ImageCard[];
  deckIndex: number;
  [key: string]: any;
}

export interface SonhosPesadelosState {
  phase: string;
  round: Round;
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
  [key: string]: any;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | SonhosPesadelosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | SonhosPesadelosStore;
