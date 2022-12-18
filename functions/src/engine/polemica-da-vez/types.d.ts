import { POLEMICA_DA_VEZ_ACTIONS } from './constants';

export type PolemicaDaVezOptions = {
  fixedRounds: boolean;
};

export interface CustomTopic extends Topic {
  custom: boolean;
}

export type Deck = Topic[];
export type CustomDeck = CustomTopic[];

export interface Decks {
  deck: Deck;
  customDeck: CustomDeck;
  deckIndex?: number;
  customDeckIndex?: number;
  pastTopics?: any[];
}

export interface PolemicaDaVezStore extends DefaultStore {
  gameOrder: PlayerId[];
}

export interface PolemicaDaVezState extends DefaultState {
  activePlayerId?: PlayerId;
  gameOrder?: PlayerId[];
  currentTopics?: any;
  currentCustomTopic?: any;
  currentTopic?: any;
  customTopic?: any;
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

export type FirebaseStateData = FirebaseFirestore.DocumentData | PolemicaDaVezState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | PolemicaDaVezStore;
