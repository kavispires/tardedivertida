import type { Item } from '../../types/tdr';
import type { IDADE_DA_PREDA_ACHIEVEMENTS, IDADE_DA_PREDA_ACTIONS, IDADE_DA_PREDA_PHASES } from './constants';

export type IdadeDaPredaOptions = {
  /**
   * Enable NSFW content
   */
  nsfw?: boolean;
};

export type ResourceData = {
  0: Item[];
  1: Item[];
  2: Item[];
  3: Item[];
  4: Item[];
  5: Item[];
};

export type Concept = {
  id: string;
  key: string;
  type: 'basic' | 'custom';
  soundId: string;
  syllable: DualLanguageValue;
  meaning: string;
  itemsIds: string[];
  playerId: PlayerId;
  age: number;
};

export type NewNameEntry = {
  id: string;
  playerId: PlayerId;
  name: string;
  itemId: string;
  conceptsIds: string[];
};

export type GalleryEntry = NewNameEntry & {
  correctPlayersIds: PlayerId[];
  guesses: Dictionary<PlayerId[]>;
};

export type IdadeDaPredaPhase = keyof typeof IDADE_DA_PREDA_PHASES;

export interface IdadeDaPredaStore extends DefaultStore {
  [key: string]: any;
}

export interface IdadeDaPredaState extends DefaultState {
  [key: string]: any;
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
