// Types
import type { VICE_CAMPEAO_ACTIONS } from './constants';

export type ViceCampeaoOptions = {
  withBots?: boolean;
};

export type RunnerCard = {
  id: UID;
  imageId: string;
  name: DualLanguageValue;
  type: 'movement-positive' | 'movement-negative' | 'movement-neutral' | 'ongoing' | 'effect' | 'random';
  quantity: number;
  description?: DualLanguageValue;
  value?: number;
  triggerKey?: string;
  autoTarget?: boolean;
  omitsTarget?: boolean;
};

export type RunActivity = {
  id: number; // index
  cardId: UID;
  playerId: UID;
  targetId: UID;
  newValue?: number;
  startingPositions: {
    [key: string]: number;
  };
  endingPositions: {
    [key: string]: number;
  };
  ongoingEffectCardId?: UID;
};

export type ResourceData = {
  cards: RunnerCard[];
};

export type GalleryEntry = {
  itemsIds: UID[];
  name: string;
  names: string[];
  correct: boolean;
};

export interface ViceCampeaoStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ViceCampeaoState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ViceCampeaoInitialState extends InitialState {
  store: ViceCampeaoStore;
  state: ViceCampeaoState;
}

export interface ViceCampeaoSubmitAction extends Payload {
  action: keyof typeof VICE_CAMPEAO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & ViceCampeaoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ViceCampeaoStore;
