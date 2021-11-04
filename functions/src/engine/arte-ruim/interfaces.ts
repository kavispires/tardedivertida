import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/interfaces';

export interface ArteRuimCard {
  id: string;
  text: string;
  level: string;
}

export interface ArteRuimCardsDatabase {
  [key: string]: ArteRuimCard;
}

export interface ArteRuimDrawing extends ArteRuimCard {
  playerId: PlayerId | null;
  drawing: string | null;
  successRate: number;
}

// OLD STUFF

export interface UsedCard {
  id: string;
  playerId: PlayerId | null;
  drawing: string | null;
  successRate: number;
  [key: string]: any;
}

export interface ArteRuimStore extends DefaultStore {
  deck: ArteRuimCardsDatabase[];
  currentCards: string[];
  pastDrawings: UsedCard[];
  [key: string]: any;
}

export interface ArteRuimState extends DefaultState {
  [key: string]: any;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ArteRuimState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ArteRuimStore;

export interface ArteRuimInitialState extends InitialState {
  store: ArteRuimStore;
  state: ArteRuimState;
}

export interface DrawingEntry {
  cardId: string | number;
  drawing: string;
  playerId: string;
}

export interface ArteRuimSubmitAction extends Payload {
  action: 'SUBMIT_DRAWING' | 'SUBMIT_VOTING';
  [key: string]: any;
}
