import type { COMUNICACAO_DUO_ACHIEVEMENTS, COMUNICACAO_DUO_ACTIONS } from './constants';

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
  deliveredBy?: PlayerId[];
};

export type HistoryEntry = {
  requesterId: PlayerId;
  clue: string;
  quantity: number;
  deliverables: string[];
};

export type Summary = {
  deliverablesLeft: number;
  deliverablesLeftForA: number;
  deliverablesLeftForB: number;
};

export type ComunicacaoDuoAchievement = keyof typeof COMUNICACAO_DUO_ACHIEVEMENTS;

export interface ComunicacaoDuoStore extends DefaultStore {
  [key: string]: any;
}

export interface ComunicacaoDuoState extends DefaultState {
  [key: string]: any;
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
