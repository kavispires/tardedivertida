import { ContenderCard, Item, SuspectCard, TextCard } from '../../types/tdr';
import { DUETOS_ACHIEVEMENTS, DUETOS_ACTIONS } from './constants';

export interface DuetosOptions {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * Enables bot selection
   */
  withBots?: boolean;
  /**
   * Enables image cards
   */
  withImages?: boolean;
  /**
   * Enables sprites round
   */
  withSprites?: boolean;
  /**
   * Enables avatars round
   */
  withAvatars?: boolean;
  /**
   * Enables words round
   */
  withWords?: boolean;
  /**
   * Enables contenders round
   */
  withContenders?: boolean;
  /**
   * Enables suspects round
   */
  withSuspects?: boolean;
}

export type ItemEntry = {
  id: string;
  type: string;
  value: any;
};

export interface ResourceData {
  items: Item[];
  images: CardId[];
  emojis: number[];
  glyphs: number[];
  clubbers: number[];
  costumes: number[];
  superHeroes: number[];
  words: TextCard[];
  suspects: SuspectCard[];
  contenders: ContenderCard[];
  decks: string[];
}

export type DuetosAchievement = keyof typeof DUETOS_ACHIEVEMENTS;

export interface DuetosStore extends DefaultStore {
  [key: string]: any;
}

export interface DuetosState extends DefaultState {
  [key: string]: any;
}

export interface DuetosInitialState extends InitialState {
  store: DuetosStore;
  state: DuetosState;
}

export interface DuetosSubmitAction extends Payload {
  action: keyof typeof DUETOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | DuetosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | DuetosStore;
