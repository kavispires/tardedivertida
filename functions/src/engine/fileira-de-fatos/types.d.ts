import type { TextCard } from '../../types/tdr';
import type { FILEIRA_DE_FATOS_ACHIEVEMENTS, FILEIRA_DE_FATOS_ACTIONS } from './constants';

export type FileiraDeFatosOptions = {
  /**
   * Uses positive scenarios
   */
  positive: boolean;
};

export type ResourceData = {
  scenarios: TextCard[];
};

export type FileiraDeFatosAchievement = keyof typeof FILEIRA_DE_FATOS_ACHIEVEMENTS;

export interface FileiraDeFatosStore extends DefaultStore {
  [key: string]: any;
}

export interface FileiraDeFatosState extends DefaultState {
  [key: string]: any;
}

export interface FileiraDeFatosInitialState extends InitialState {
  store: FileiraDeFatosStore;
  state: FileiraDeFatosState;
}

export interface FileiraDeFatosSubmitAction extends Payload {
  action: keyof typeof FILEIRA_DE_FATOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | FileiraDeFatosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | FileiraDeFatosStore;
