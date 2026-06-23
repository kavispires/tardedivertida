import type { TextCardData } from '../../types/tdr';
import type { POLEMICA_DA_VEZ_ACTIONS } from './constants';

export type PolemicaDaVezOptions = {
  fixedRounds: boolean;
};

export interface CustomTweet extends TextCardData {
  custom: boolean;
}

export type Deck = TextCardData[];
export type CustomDeck = CustomTweet[];

export interface Decks {
  deck: Deck;
  customDeck: CustomDeck;
  deckIndex?: number;
  customDeckIndex?: number;
  pastTweets?: any[];
}

export interface PolemicaDaVezStore extends DefaultStore {
  gameOrder: UID[];
}

export interface PolemicaDaVezState extends DefaultState {
  activePlayerId?: UID;
  gameOrder?: UID[];
  currentTweets?: any;
  currentCustomTweet?: any;
  currentTweet?: any;
  customTweet?: any;
  totalLikes?: any;
  ranking?: any;
  winners?: any;
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface PolemicaDaVezInitialState extends InitialState {
  store: PolemicaDaVezStore;
  state: PolemicaDaVezState;
}

export interface PolemicaDaVezSubmitAction extends Payload {
  action: keyof typeof POLEMICA_DA_VEZ_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | PolemicaDaVezState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | PolemicaDaVezStore;
