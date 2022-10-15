import { GALERIA_DE_SONHOS_ACHIEVEMENTS, GALERIA_DE_SONHOS_ACTIONS } from './constants';

export type GaleriaDeSonhosOptions = {
  withBots?: boolean;
};

export type AllWords = {
  [key: string]: TextCard;
};

export type ResourceData = {
  allWords: AllWords;
};

export type ImageCard = {
  id: string;
  used: boolean;
  matchedPlayers?: PlayerId[];
  text?: string;
};

export type PlayerCard = {
  cardId: string;
  used: boolean;
  matchedPlayers: PlayerId[];
  score: number;
};

export interface GaleriaDeSonhosStore extends DefaultStore {
  tableDeck: ImageCard[];
  deck: TextCard[];
  gameOrder: GameOrder;
  withBots?: boolean;
  [key: string]: any;
}

export interface GaleriaDeSonhosState extends DefaultState {
  [key: string]: any;
}

export interface GaleriaDeSonhosInitialState extends InitialState {
  store: GaleriaDeSonhosStore;
  state: GaleriaDeSonhosState;
}

export interface GaleriaDeSonhosSubmitAction extends Payload {
  action: keyof typeof GALERIA_DE_SONHOS_ACTIONS;
}

export type GaleriaDeSonhosAchievement = keyof typeof GALERIA_DE_SONHOS_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData | GaleriaDeSonhosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | GaleriaDeSonhosStore;
