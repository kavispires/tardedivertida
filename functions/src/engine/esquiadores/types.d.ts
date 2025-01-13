import type { DilemmaCard } from '../../types/tdr';
import type { ESQUIADORES_ACHIEVEMENTS, ESQUIADORES_ACTIONS } from './constants';

export type EsquiadoresOptions = {
  /**
   * Allow nsfw content
   */
  nsfw: boolean;
};

export type ResourceData = {
  dilemmas: DilemmaCard[];
};

export type MountainDilemma = {
  id: number;
  spriteId: string;
  dilemma: DilemmaCard;
  selected: boolean;
  direction: 'left' | 'right' | null;
  players?: string[];
};

export type Lodge = {
  id: number;
  selected: boolean;
  playersIds: PlayerId[];
};

export type EsquiadoresAchievement = keyof typeof ESQUIADORES_ACHIEVEMENTS;

export interface EsquiadoresStore extends DefaultStore {
  deck: DilemmaCard[];
}

export interface EsquiadoresState extends DefaultState {
  [key: string]: any;
}

export interface EsquiadoresInitialState extends InitialState {
  store: EsquiadoresStore;
  state: EsquiadoresState;
}

export interface EsquiadoresSubmitAction extends Payload {
  action: keyof typeof ESQUIADORES_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | EsquiadoresState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | EsquiadoresStore;
