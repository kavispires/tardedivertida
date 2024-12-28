import type { ContenderCard, Item, SuspectCard, TextCard } from '../../types/tdr';
import type { DUETOS_ACHIEVEMENTS, DUETOS_ACTIONS } from './constants';

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

type GalleryItem = {
  pairId: string;
  pair: (ItemEntry | undefined)[];
  players: PlayerId[];
};

export type Gallery = GalleryItem[];

export type DuetosAchievement = keyof typeof DUETOS_ACHIEVEMENTS;

export interface DuetosStore extends DefaultStore<DuetosOptions> {
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

export type FirebaseStateData = FirebaseFirestore.DocumentData & DuetosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & DuetosStore;
