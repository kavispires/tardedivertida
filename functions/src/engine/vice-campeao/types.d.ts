import type { VICE_CAMPEAO_ACHIEVEMENTS, VICE_CAMPEAO_ACTIONS } from './constants';

export type ViceCampeaoOptions = {
  withBots?: boolean;
};

export type RunnerCard = {
  id: CardId;
  imageId: string;
  name: DualLanguageValue;
  type: 'movement-positive' | 'movement-negative' | 'movement-neutral' | 'ongoing' | 'effect';
  quantity: number;
  description?: DualLanguageValue;
  value?: number;
  triggerKey?: string;
  noTarget?: boolean;
};

export type RunActivity = {
  id: number; // index
  cardId: CardId;
  playerId: PlayerId;
  targetId: PlayerId;
  newValue?: number;
  startingPositions: {
    [key: string]: number;
  };
  endingPositions: {
    [key: string]: number;
  };
  ongoingEffectCardId?: CardId;
};

export type ViceCampeaoAchievement = keyof typeof VICE_CAMPEAO_ACHIEVEMENTS;

export type ResourceData = {
  cards: RunnerCard[];
};

export type GalleryEntry = {
  itemsIds: CardId[];
  name: string;
  names: string[];
  correct: boolean;
};

export interface ViceCampeaoStore extends DefaultStore {
  [key: string]: any;
}

export interface ViceCampeaoState extends DefaultState {
  [key: string]: any;
}

export interface ViceCampeaoInitialState extends InitialState {
  store: ViceCampeaoStore;
  state: ViceCampeaoState;
}

export interface ViceCampeaoSubmitAction extends Payload {
  action: keyof typeof VICE_CAMPEAO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ViceCampeaoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ViceCampeaoStore;
