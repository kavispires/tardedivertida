import type { TextCard } from '../../types/tdr';
import type { CRUZA_PALAVRAS_ACHIEVEMENTS, CRUZA_PALAVRAS_ACTIONS } from './constants';

export type CruzaPalavrasOptions = {
  /**
   * Adds a row and column to the grid
   */
  largerGrid: boolean;
  /**
   * Determines the source of the grid headers
   */
  gridType: 'words' | 'properties' | 'contenders' | 'imageCards' | 'items';
  /**
   * Allow nsfw content
   */
  nsfw: boolean;
} & ContendersDecksOptions;

export type TextCardWithType = TextCard & { type?: string };

export type Deck = TextCardWithType[];

export type ResourceData = {
  deck: Deck;
};

export type PastClues = Dictionary<string[]>;

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

export interface CruzaPalavrasStore extends DefaultStore<CruzaPalavrasOptions> {
  deck: Deck;
  pastClues: PastClues;
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

export type FirebaseStateData = FirebaseFirestore.DocumentData & CruzaPalavrasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & CruzaPalavrasStore;
