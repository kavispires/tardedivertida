// Types
import type { ItemData } from '../../types/tdr';
import type { QUAL_QUESITO_ACTIONS, QUAL_QUESITO_PHASES } from './constants';

export type QualQuesitoOptions = {
  /**
   * If nsfw topics are allowed
   */
  nsfw: boolean;
};

export type ResourceData = {
  allItems: ItemData[];
};

export type TableEntry = {
  playerId: UID;
  cardId: UID;
  accepted: boolean;
};

export type GalleryEntry = {
  category: string;
  creatorId: UID;
  items: TableEntry[];
};

export type QualQuesitoPhase = keyof typeof QUAL_QUESITO_PHASES;

export interface QualQuesitoStore extends DefaultStore<QualQuesitoOptions> {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface QualQuesitoState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
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
