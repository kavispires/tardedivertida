import { DefaultState, DefaultStore, InitialState, Payload, PlayerId, PlayerName } from '../../utils/types';

export interface WordCard {
  id: string;
  text: string;
}

export interface AllWords {
  [key: string]: WordCard;
}

export interface ResourceData {
  allWords: AllWords;
}

export type Deck = WordCard[];

export interface ClueEntry {
  playerId: PlayerId;
  clue: string;
  coordinate: number;
}

export interface GridCell {
  index: number;
  kind: string;
  text: string;
  available: boolean;
  id?: string;
  x?: number;
  y?: number;
  xText?: string;
  yText?: string;
  writable?: boolean;
  playerId?: string | null;
}

export interface NewScores {
  [key: string]: {
    previousScore: number;
    gainedPoints: number[];
    newScore: number;
  };
}

export interface RankingEntry {
  playerId: PlayerId;
  name: PlayerName;
  previousScore: number;
  gainedPoints: number[];
  newScore: number;
}

export interface CruzaPalavrasStore extends DefaultStore {
  deck?: Deck;
  [key: string]: any;
}

export interface CruzaPalavrasState extends DefaultState {
  [key: string]: any;
}

export interface XTudoPalavrasInitialState extends InitialState {
  store: CruzaPalavrasStore;
  state: CruzaPalavrasState;
}

export interface XTudoPalavrasSubmitAction extends Payload {
  action: 'SUBMIT_CLUE' | 'SUBMIT_GUESSES';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | CruzaPalavrasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | CruzaPalavrasStore;
