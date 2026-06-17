import type { TextCard } from '../../types/tdr';
import type { GALERIA_DE_SONHOS_ACTIONS } from './constants';

export type GaleriaDeSonhosOptions = {
  /**
   * Add bots to the game
   */
  withBots?: boolean;
  /**
   * UI will required minimum of 4-7 cards selected
   */
  surpriseMode: boolean;
};

export type AllWords = {
  [key: string]: TextCard;
};

export type ResourceData = {
  allWords: AllWords;
  images: UID[];
};

export type ImageCard = {
  id: string;
  used: boolean;
  matchedPlayers?: UID[];
  text?: string;
};

export type PlayerCard = {
  cardId: string;
  used: boolean;
  matchedPlayers: UID[];
  score: number;
};

export type ImageCardMatch = {
  id: UID;
  used: boolean;
  text: string;
  matchedPlayers: UID[];
};

export interface GaleriaDeSonhosStore extends DefaultStore {
  tableDeck: ImageCard[];
  deck: TextCard[];
  gameOrder: GameOrder;
  withBots?: boolean;
}

export interface GaleriaDeSonhosState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface GaleriaDeSonhosInitialState extends InitialState {
  store: GaleriaDeSonhosStore;
  state: GaleriaDeSonhosState;
}

export interface GaleriaDeSonhosSubmitAction extends Payload {
  action: keyof typeof GALERIA_DE_SONHOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | GaleriaDeSonhosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | GaleriaDeSonhosStore;
