import type { Item, ObjectFeatureCard } from '../../types/tdr';
import type { MESMICE_ACHIEVEMENTS, MESMICE_ACTIONS, OUTCOME } from './constants';

export type MesmiceOptions = {
  /**
   * Allow NSFW items
   */
  nsfw: boolean;
  /**
   * Uses more complex features
   */
  complexMode: boolean;
  /**
   * Uses 8 features instead of 6
   */
  hardMode: boolean;
};

export type ResourceData = {
  features: ObjectFeatureCard[];
  items: Partial<Item>[];
};

export type ObjectCardObj = Pick<Item, 'id' | 'name'>;

export type HistoryEntry = {
  featureId: CardId;
  pass: boolean;
  votes: PlayerId[];
  score: number;
};

export type MesmiceGalleryEntry = {
  playerId: PlayerId;
  item: ObjectCardObj;
  clue: string;
  featureId: CardId;
  history: HistoryEntry[];
};

export type Outcome = keyof typeof OUTCOME;

export type ExtendedObjectFeatureCard = ObjectFeatureCard & { eliminated?: boolean };

export type MesmiceAchievements = keyof typeof MESMICE_ACHIEVEMENTS;

export interface MesmiceStore extends DefaultStore {
  [key: string]: any;
}

export interface MesmiceState extends DefaultState {
  [key: string]: any;
}

export interface MesmiceInitialState extends InitialState {
  store: MesmiceStore;
  state: MesmiceState;
}

export interface MesmiceSubmitAction extends Payload {
  action: keyof typeof MESMICE_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | MesmiceState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | MesmiceStore;
