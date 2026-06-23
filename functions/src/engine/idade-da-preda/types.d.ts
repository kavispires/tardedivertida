import type { ItemData } from '../../types/tdr';
import type { IDADE_DA_PREDA_ACHIEVEMENTS, IDADE_DA_PREDA_ACTIONS, IDADE_DA_PREDA_PHASES } from './constants';

export type IdadeDaPredaOptions = {
  /**
   * Enable NSFW content
   */
  nsfw?: boolean;
};

export type ResourceData = {
  0: ItemData[];
  1: ItemData[];
  2: ItemData[];
  3: ItemData[];
  4: ItemData[];
  5: ItemData[];
};

export type ConceptData = {
  id: string;
  key: string;
  type: 'basic' | 'custom';
  soundId: string;
  syllable: DualLanguageValue;
  meaning: string;
  itemsIds: string[];
  playerId: UID;
  age: number;
};

export type NewNameEntry = {
  id: string;
  playerId: UID;
  name: string;
  itemId: string;
  conceptsIds: string[];
};

export type GalleryEntry = NewNameEntry & {
  correctPlayersIds: UID[];
  guesses: Dictionary<UID[]>;
};

export type IdadeDaPredaPhase = keyof typeof IDADE_DA_PREDA_PHASES;

export interface IdadeDaPredaStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface IdadeDaPredaState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface IdadeDaPredaInitialState extends InitialState {
  state: IdadeDaPredaState;
  store: IdadeDaPredaStore;
}

export type IdadeDaPredaAchievement = keyof typeof IDADE_DA_PREDA_ACHIEVEMENTS;

export interface IdadeDaPredaSubmitAction extends Payload {
  action: keyof typeof IDADE_DA_PREDA_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | IdadeDaPredaState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | IdadeDaPredaStore;
