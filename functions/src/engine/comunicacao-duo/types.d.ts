// Types
import type { COMUNICACAO_DUO_ACTIONS } from './constants';

export type ComunicacaoDuoOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   *
   */
  deckType: 'items' | 'images' | 'contenders' | 'suspects' | 'words';
  /**
   *
   */
  clueInputType: 'alien-keyboard' | 'text';
};

export type ResourceData = {
  deck: DeckEntry[];
};

export type DeckEntry = {
  id: string;
  affiliation: [string, string];
  status: string;
  data: any;
  deliveredBy?: UID[];
};

export type HistoryEntry = {
  requesterId: UID;
  clue: string;
  quantity: number;
  deliverables: string[];
};

export type Summary = {
  deliverablesLeft: number;
  deliverablesLeftForA: number;
  deliverablesLeftForB: number;
};

export interface ComunicacaoDuoStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ComunicacaoDuoState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ComunicacaoDuoInitialState extends InitialState {
  store: ComunicacaoDuoStore;
  state: ComunicacaoDuoState;
}

export interface ComunicacaoDuoSubmitAction extends Payload {
  action: keyof typeof COMUNICACAO_DUO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ComunicacaoDuoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ComunicacaoDuoStore;
