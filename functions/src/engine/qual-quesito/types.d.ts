import type { Item } from '../../types/tdr';
import type { QUAL_QUESITO_ACHIEVEMENTS, QUAL_QUESITO_ACTIONS, QUAL_QUESITO_PHASES } from './constants';

export type QualQuesitoOptions = {
  /**
   * If nsfw topics are allowed
   */
  nsfw: boolean;
};

export type ResourceData = {
  allItems: Item[];
};

export type QualQuesitoPhase = keyof typeof QUAL_QUESITO_PHASES;
export type QualQuesitoAchievement = keyof typeof QUAL_QUESITO_ACHIEVEMENTS;

export interface QualQuesitoStore extends DefaultStore<QualQuesitoOptions> {
  [key: string]: any;
}

export interface QualQuesitoState extends DefaultState {
  [key: string]: any;
}

export interface QualQuesitoInitialState extends InitialState {
  store: QualQuesitoStore;
  state: QualQuesitoState;
}

export interface QualQuesitoSubmitAction extends Payload {
  action: keyof typeof QUAL_QUESITO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & QualQuesitoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & QualQuesitoStore;
