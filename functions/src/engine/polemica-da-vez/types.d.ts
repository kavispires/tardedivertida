import { POLEMICA_DA_VEZ_ACHIEVEMENTS, POLEMICA_DA_VEZ_ACTIONS } from './constants';

export type PolemicaDaVezOptions = {
  fixedRounds: boolean;
};

export interface CustomTweet extends Tweet {
  custom: boolean;
}

export type Deck = Tweet[];
export type CustomDeck = CustomTweet[];

export interface Decks {
  deck: Deck;
  customDeck: CustomDeck;
  deckIndex?: number;
  customDeckIndex?: number;
  pastTweets?: any[];
}

export interface PolemicaDaVezStore extends DefaultStore {
  gameOrder: PlayerId[];
}

export interface PolemicaDaVezState extends DefaultState {
  activePlayerId?: PlayerId;
  gameOrder?: PlayerId[];
  currentTweets?: any;
  currentCustomTweet?: any;
  currentTweet?: any;
  customTweet?: any;
  totalLikes?: any;
  ranking?: any;
  winners?: any;
  [key: string]: any;
}

export interface PolemicaDaVezInitialState extends InitialState {
  store: PolemicaDaVezStore;
  state: PolemicaDaVezState;
}

export interface PolemicaDaVezSubmitAction extends Payload {
  action: keyof typeof POLEMICA_DA_VEZ_ACTIONS;
}

export type PolemicaDaVezAchievement = keyof typeof POLEMICA_DA_VEZ_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData | PolemicaDaVezState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | PolemicaDaVezStore;
