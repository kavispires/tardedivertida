import type { TextCard } from '../../types/tdr';
import type { MEDIDAS_NAO_EXATAS_ACHIEVEMENTS, MEDIDAS_NAO_EXATAS_ACTIONS } from './constants';

export type ResourceData = {
  allWords: TextCard[];
  allDescriptors: TextCard[];
};

export type Guess = {
  cardId: CardId;
  level: number;
};

export type GalleryEntry = {
  secretWordId: CardId;
  cards: Record<CardId, TextCard & { playersIds?: PlayerId[] }>;
  metricsDescriptors: Dictionary<TextCard>;
  metrics: Record<CardId, number>;
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
