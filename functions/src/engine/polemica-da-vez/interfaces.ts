import { Meta, Payload, PlayerId, Players, Round } from '../../utils/interfaces';

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

export interface PolemicaDaVezStore {
  language: string;
  gameOrder: PlayerId[];
  [key: string]: any;
}

export interface PolemicaDaVezState {
  phase: string;
  round: Round;
  activePlayer?: PlayerId;
  [key: string]: any;
}

export interface PolemicaDaVezInitialState {
  meta: Meta;
  players: Players;
  store: PolemicaDaVezStore;
  state: PolemicaDaVezState;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | PolemicaDaVezState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | PolemicaDaVezStore;

export interface PolemicaDaVezSubmitAction extends Payload {
  action: 'SUBMIT_TOPIC' | 'SUBMIT_REACTION';
  [key: string]: any;
}
