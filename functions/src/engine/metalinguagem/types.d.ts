import type { ItemData } from '../../types/tdr';
import type { METALINGUAGEM_ACTIONS, WORD_LENGTH_STATUS } from './constants';

export type MetalinguagemOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
};

export type ResourceData = {
  items: ItemData[];
};

export type GalleryEntry = {
  itemsIds: ItemData[];
  name: string;
  names: string[];
  correct: boolean;
};

export type WordLength = {
  wordLength: number;
  status: keyof typeof WORD_LENGTH_STATUS;
};

export interface MetalinguagemStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface MetalinguagemState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface MetalinguagemInitialState extends InitialState {
  store: MetalinguagemStore;
  state: MetalinguagemState;
}

export interface MetalinguagemSubmitAction extends Payload {
  action: keyof typeof METALINGUAGEM_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | MetalinguagemState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | MetalinguagemStore;
