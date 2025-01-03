import type { ContenderCard } from '../../types/tdr';
import type { QUEM_SOU_EU_ACHIEVEMENTS, QUEM_SOU_EU_ACTIONS } from './constants';

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
  characters: ContenderCard[];
  imageCards: ContenderCard[];
}

export interface Character {
  id: CardId;
  name: DualLanguageValue;
  description: DualLanguageValue;
  playerId: PlayerId;
}

export interface QuemSouEuStore extends DefaultStore {
  [key: string]: any;
}

export interface QuemSouEuState extends DefaultState {
  [key: string]: any;
}

export interface QuemSouEuInitialState extends InitialState {
  store: QuemSouEuStore;
  state: QuemSouEuState;
}

export type QuemSouEuAchievement = keyof typeof QUEM_SOU_EU_ACHIEVEMENTS;

export interface QuemSouEuSubmitAction extends Payload {
  action: keyof typeof QUEM_SOU_EU_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | QuemSouEuState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | QuemSouEuStore;
