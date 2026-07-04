// Types
import type { ContenderCardData, ItemData, SuspectCardData, TextCardData } from '../../types/tdr';
import type { DUETOS_ACTIONS } from './constants';

export type DuetosOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw: boolean;
  /**
   * Enables bot selection
   */
  withBots: boolean;
  /**
   * Special grounds
   */
  specialRounds: 'images' | 'sprites' | 'avatars' | 'words' | 'contenders' | 'suspects';
};

export type ItemEntry = {
  id: string;
  type: string;
  value: any;
};

export interface ResourceData {
  items: ItemData[];
  images: UID[];
  emojis: number[];
  glyphs: number[];
  clubbers: number[];
  costumes: number[];
  superHeroes: number[];
  words: TextCardData[];
  suspects: SuspectCardData[];
  contenders: ContenderCardData[];
  decks: string[];
}

type GalleryItem = {
  pairId: string;
  pair: (ItemEntry | undefined)[];
  round: number;
  players: UID[];
};

export type Gallery = GalleryItem[];

export interface DuetosStore extends DefaultStore<DuetosOptions> {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface DuetosState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface DuetosInitialState extends InitialState {
  store: DuetosStore;
  state: DuetosState;
}

export interface DuetosSubmitAction extends Payload {
  action: keyof typeof DUETOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & DuetosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & DuetosStore;
