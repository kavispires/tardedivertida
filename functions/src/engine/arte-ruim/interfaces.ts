import { Meta, Payload, PlayerId, Players, Round } from '../../utils/interfaces';

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

export interface ArteRuimStore {
  language: string;
  deck: ArteRuimCardsDatabase[];
  currentCards: string[];
  pastDrawings: UsedCard[];
  [key: string]: any;
}

export interface ArteRuimState {
  phase: string;
  round: Round;
  [key: string]: any;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ArteRuimState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ArteRuimStore;

export interface ArteRuimInitialState {
  meta: Meta;
  players: Players;
  store: ArteRuimStore;
  state: ArteRuimState;
}

export interface DrawingEntry {
  cardId: string | number;
  drawing: string;
  playerId: string;
}

export interface SubmitDrawingPayload extends Payload {
  drawing: string;
  cardId: string;
}
