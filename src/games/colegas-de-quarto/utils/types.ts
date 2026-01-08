// Types
import type { GameRanking } from 'types/game';
import type { TextCard } from 'types/tdr';

export type SubmitWordsPayload = {
  selectedWordsIds: string[];
};

export type SubmitCluesPayload = {
  clues: string[];
};

export type SubmitGuessesPayload = {
  guesses: Record<string, string[]>; // clueEntryId -> things ids[]
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
  playerId: PlayerId;
  clue: string | null;
  correct: PlayerId[];
  misses: {
    guesserId: PlayerId;
    guesses: string[];
  }[];
};

export type HouseHappiness = {
  gained: number[];
  total: number;
};

export type PhaseWordsSelectionState = {
  happiness: HouseHappiness;
  pool: TextCard[];
};

export type PhaseClueWritingState = {
  happiness: HouseHappiness;
  board: BoardEntry[];
};

export type PhaseGuessingState = {
  happiness: HouseHappiness;
  gallery: GalleryEntry[];
};

export type PhaseRevealState = {
  happiness: HouseHappiness;
  gallery: GalleryEntry[];
  ranking: GameRanking;
  foundTarget: PlayerId[];
};

export type PhaseTemplateState = {
  something: string;
};
