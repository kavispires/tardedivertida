import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/interfaces';

export interface Topic {
  id: string;
  text: string;
  custom?: boolean;
}

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
  action: 'SUBMIT_TOPIC' | 'SUBMIT_REACTION';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | PolemicaDaVezState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | PolemicaDaVezStore;
