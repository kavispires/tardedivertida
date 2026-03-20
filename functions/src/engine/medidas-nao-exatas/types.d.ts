import type { TextCard } from '../../types/tdr';
import type { MEDIDAS_NAO_EXATAS_ACHIEVEMENTS, MEDIDAS_NAO_EXATAS_ACTIONS } from './constants';

export type ResourceData = {
  allWords: TextCard[];
  allDescriptors: TextCard[];
};

export type Guess = {
  cardId: UID;
  level: number;
  timestamp: number;
  playerId?: UID;
  used?: boolean;
  retry?: boolean;
};

export type GalleryBracket = {
  score: number;
  playersIds: UID[];
  wrongGuesses: {
    playerId: UID;
    cardId: UID;
    invalid?: boolean;
  }[];
};

export type GalleryEntry = {
  secretWordId: UID;
  cards: Record<UID, TextCard>;
  metricsDescriptors: Record<string, TextCard[]>;
  metrics: Record<UID, number>;
  brackets: GalleryBracket[];
};

export type MedidasNaoExatasAchievement = keyof typeof MEDIDAS_NAO_EXATAS_ACHIEVEMENTS;

export interface MedidasNaoExatasStore extends DefaultStore {
  [key: string]: any;
}

export interface MedidasNaoExatasState extends DefaultState {
  [key: string]: any;
}

export interface MedidasNaoExatasInitialState extends InitialState {
  store: MedidasNaoExatasStore;
  state: MedidasNaoExatasState;
}

export interface MedidasNaoExatasSubmitAction extends Payload {
  action: keyof typeof MEDIDAS_NAO_EXATAS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & MedidasNaoExatasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & MedidasNaoExatasStore;
