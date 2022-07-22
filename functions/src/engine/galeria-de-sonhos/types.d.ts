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
  action: 'SUBMIT_WORD' | 'SUBMIT_CARDS' | 'PLAY_CARD';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | GaleriaDeSonhosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | GaleriaDeSonhosStore;
