import type { ContenderCardData } from '../../types/tdr';
import type { QUEM_SOU_EU_ACTIONS } from './constants';

export type QuemSouEuOptions = {
  /**
   * Adds two more characters to the table
   */
  moreCharacters?: boolean;
  /**
   * Possibly include nsfw characters
   */
  nsfw?: boolean;
  /**
   * Uses image cards instead of characters
   */
  imageCardsMode?: boolean;
} & ContendersDecksOptions;

export interface ResourceData {
  characters: ContenderCardData[];
  imageCards: ContenderCardData[];
}

export interface Character {
  id: UID;
  name: DualLanguageValue;
  description: DualLanguageValue;
  playerId: UID;
}

export interface QuemSouEuStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface QuemSouEuState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface QuemSouEuInitialState extends InitialState {
  store: QuemSouEuStore;
  state: QuemSouEuState;
}

export interface QuemSouEuSubmitAction extends Payload {
  action: keyof typeof QUEM_SOU_EU_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | QuemSouEuState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | QuemSouEuStore;
