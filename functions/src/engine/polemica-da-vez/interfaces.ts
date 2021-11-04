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
}

export interface PolemicaDaVezStore extends DefaultStore {
  gameOrder: PlayerId[];
}

export interface PolemicaDaVezState extends DefaultState {
  activePlayer?: PlayerId;
  [key: string]: any;
}

export interface PolemicaDaVezInitialState extends InitialState {
  store: PolemicaDaVezStore;
  state: PolemicaDaVezState;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | PolemicaDaVezState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | PolemicaDaVezStore;

export interface PolemicaDaVezSubmitAction extends Payload {
  action: 'SUBMIT_TOPIC' | 'SUBMIT_REACTION';
}
