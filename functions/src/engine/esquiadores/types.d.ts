import type { DilemmaCardData } from '../../types/tdr';
import type { ESQUIADORES_ACTIONS } from './constants';

export type EsquiadoresOptions = {
  /**
   * Allow nsfw content
   */
  nsfw: boolean;
};

export type ResourceData = {
  dilemmas: DilemmaCardData[];
};

export type MountainDilemma = {
  id: number;
  spriteId: string;
  dilemma: DilemmaCardData;
  selected: boolean;
  direction: 'left' | 'right' | null;
  players?: string[];
};

export type Lodge = {
  id: number;
  selected: boolean;
  playersIds: UID[];
};

export interface EsquiadoresStore extends DefaultStore {
  deck: DilemmaCardData[];
}

export interface EsquiadoresState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
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
