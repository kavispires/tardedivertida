// Internal
import type { WORD_LENGTH_STATUS } from './constants';

export type SubmitWordPayload = {
  names: string[];
  indexes: number[];
  newWord: string;
};

export type SubmitGuessesPayload = {
  guesses: string[];
};

export type WordLength = {
  wordLength: number;
  status: keyof typeof WORD_LENGTH_STATUS;
};

export type MetalinguagemGalleryEntry = {
  itemsIds: CardId[];
  name: string;
  names: string[];
  correct: boolean;
};

export type PhaseWordCreationState = {
  creatorId: PlayerId;
  items: string[];
  turnOrder: GameOrder;
  wordLengths: WordLength[];
  beginsWith: string;
  endsWith: string;
};

export type PhaseGuessingState = {
  creatorId: PlayerId;
  items: string[];
  turnOrder: GameOrder;
  wordLengths: WordLength[];
  word: string;
  names: string[];
  namesIndexes: number[];
  newWord: string;
  beginsWith: string;
  endsWith: string;
};

export type PhaseResultsState = {
  creatorId: PlayerId;
  items: string[];
  turnOrder: GameOrder;
  wordLengths: WordLength[];
  newWord: string;
  names: string[];
  namesIndexes: number[];
  guessPlayersPerItem: Record<string, PlayerId[]>;
  outcome: keyof typeof WORD_LENGTH_STATUS;
  beginsWith: string;
  endsWith: string;
  mostVotedItems: string[];
};
