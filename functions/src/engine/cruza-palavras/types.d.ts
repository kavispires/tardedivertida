import { TextCard } from '../../types/tdr';
import { CRUZA_PALAVRAS_ACHIEVEMENTS, CRUZA_PALAVRAS_ACTIONS } from './constants';

export type CruzaPalavrasOptions = {
  /**
   * Adds a row and column to the grid
   */
  largerGrid: boolean;
  /**
   * Uses things-properties data instead of words
   */
  propertiesGrid?: boolean;
  /**
   * Uses contenders instead of words
   */
  contenderGrid?: boolean;
  /**
   * Use image cards instead of words
   */
  imageGrid?: boolean;
  /**
   * Possibly include nsfw images
   */
  nsfw?: boolean;
};

export type ResourceData = {
  deck: TextCard[];
};

export type Deck = TextCard[];

export type PastClues = Collection<string[]>;

export type ClueEntry = {
  playerId: PlayerId;
  clue: string;
  coordinate: number;
};

export type GridCell = {
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
};

export type CruzaPalavrasAchievement = keyof typeof CRUZA_PALAVRAS_ACHIEVEMENTS;

export interface CruzaPalavrasStore extends DefaultStore {
  deck?: Deck;
  pastClues?: PastClues;
  [key: string]: any;
}

export interface CruzaPalavrasState extends DefaultState {
  [key: string]: any;
}

export interface CruzaPalavrasInitialState extends InitialState {
  store: CruzaPalavrasStore;
  state: CruzaPalavrasState;
}

export interface CruzaPalavrasSubmitAction extends Payload {
  action: keyof typeof CRUZA_PALAVRAS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | CruzaPalavrasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | CruzaPalavrasStore;
