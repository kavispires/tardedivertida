import type { TextCardData } from '../../types/tdr';
import type { COLEGAS_DE_QUARTO_ACTIONS } from './constants';

export type ColegasDeQuartoOptions = {
  /**
   * Determines the source of the grid headers
   */
  wordsSource: 'words' | 'properties';
  /**
   * Allow nsfw content
   */
  nsfw: boolean;
} & ContendersDecksOptions;

export type ResourceData = {
  deck: TextCardData[];
};

export type BoardEntry = {
  id: string;
  cardId: string;
  text: string;
  playerId: string;
};

export type PlayerAssignedPair = {
  id: string;
  ids: string[];
  clue: string;
};

export type GalleryEntry = {
  id: string;
  ids: string[];
  words: string[];
  playerId: UID;
  clue: string | null;
  correct: UID[];
  misses: {
    guesserId: UID;
    guesses: string[];
  }[];
};

export type HouseHappiness = {
  gained: number[];
  goal: number;
  total: number;
};

export type PastClues = Dictionary<string[]>;

export interface ColegasDeQuartoStore extends DefaultStore<ColegasDeQuartoOptions> {
  deck: TextCardData[];
  pastClues: PastClues;
}

export interface ColegasDeQuartoState extends DefaultState {
  [key: string]: unknown;
}

export interface ColegasDeQuartoInitialState extends InitialState {
  store: ColegasDeQuartoStore;
  state: ColegasDeQuartoState;
}

export interface ColegasDeQuartoSubmitAction extends Payload {
  action: keyof typeof COLEGAS_DE_QUARTO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & ColegasDeQuartoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ColegasDeQuartoStore;
