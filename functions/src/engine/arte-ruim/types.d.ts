import { DefaultState, DefaultStore, InitialState, Payload, PlainObject, PlayerId } from '../../utils/types';

export interface ArteRuimCard {
  id: string;
  text: string;
  level: number;
}

export interface ArteRuimLevel4Card {
  id: string;
  theme: string;
  cards: PlainObject;
}

export interface PerLevelCards {
  [key: string]: ArteRuimCard[];
}

export interface ArteRuimCardsDatabase {
  [key: string]: ArteRuimCard;
}

export interface ArteRuimDrawing extends ArteRuimCard {
  playerId: PlayerId | null;
  drawing: string | null;
  successRate: number;
}

export interface ArteRuimStore extends DefaultStore {
  deck: ArteRuimCardsDatabase[];
  currentCards: string[];
  pastDrawings: ArteRuimDrawing[];
}

export interface ArteRuimState extends DefaultState {
  drawings?: any;
  gallery?: any;
  cards?: any;
  ranking?: any;
  winners?: any;
  [key: string]: any;
}
export interface ArteRuimInitialState extends InitialState {
  store: ArteRuimStore;
  state: ArteRuimState;
}

export interface ArteRuimSubmitAction extends Payload {
  action: 'SUBMIT_DRAWING' | 'SUBMIT_VOTING';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ArteRuimState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ArteRuimStore;
