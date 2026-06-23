// Types
import type { Achievement } from 'types/game';
import type { ItemData } from 'types/tdr';
// Internal
import type { WORD_LENGTH_STATUS } from './constants';

/**
 * Payload for submitting a created word
 */
export type SubmitWordPayload = {
  /**
   * Names of items used to create the word
   */
  names: string[];
  /**
   * Indexes of the items
   */
  indexes: number[];
  /**
   * The newly created word
   */
  newWord: string;
};

/**
 * Payload for submitting guesses
 */
export type SubmitGuessesPayload = {
  /**
   * List of guessed items
   */
  guesses: string[];
};

/**
 * Word length constraint and its status
 */
export type WordLength = {
  /**
   * Required length of the word
   */
  wordLength: number;
  /**
   * Status of the word length constraint
   */
  status: keyof typeof WORD_LENGTH_STATUS;
};

/**
 * Gallery entry for a metalinguagem round
 */
export type MetalinguagemGalleryEntry = {
  /**
   * IDs of the items used
   */
  itemsIds: UID[];
  /**
   * Name of the created word
   */
  name: string;
  /**
   * Names of items used to create the word
   */
  names: string[];
  /**
   * Whether the word was guessed correctly
   */
  correct: boolean;
};

/**
 * State for the word creation phase
 */
export type PhaseWordCreationState = {
  /**
   * ID of the player creating the word
   */
  creatorId: UID;
  /**
   * Available items to use for word creation
   */
  items: ItemData[];
  /**
   * Order of players' turns
   */
  turnOrder: GameOrder;
  /**
   * Word length constraints
   */
  wordLengths: WordLength[];
  /**
   * Letter the word must begin with
   */
  beginsWith: string;
  /**
   * Letter the word must end with
   */
  endsWith: string;
};

/**
 * State for the guessing phase
 */
export type PhaseGuessingState = {
  /**
   * ID of the player who created the word
   */
  creatorId: UID;
  /**
   * Available items that were used
   */
  items: ItemData[];
  /**
   * Order of players' turns
   */
  turnOrder: GameOrder;
  /**
   * Word length constraints
   */
  wordLengths: WordLength[];
  /**
   * The word that was created
   */
  word: string;
  /**
   * Names of items used to create the word
   */
  names: string[];
  /**
   * Indexes of the items used
   */
  namesIndexes: number[];
  /**
   * The newly created word
   */
  newWord: string;
  /**
   * Letter the word begins with
   */
  beginsWith: string;
  /**
   * Letter the word ends with
   */
  endsWith: string;
};

/**
 * State for the results phase
 */
export type PhaseResultsState = {
  /**
   * ID of the player who created the word
   */
  creatorId: UID;
  /**
   * Available items that were used
   */
  items: ItemData[];
  /**
   * Order of players' turns
   */
  turnOrder: GameOrder;
  /**
   * Word length constraints
   */
  wordLengths: WordLength[];
  /**
   * The newly created word
   */
  newWord: string;
  /**
   * Names of items used to create the word
   */
  names: string[];
  /**
   * Indexes of the items used
   */
  namesIndexes: number[];
  /**
   * Map of items to players who guessed them
   */
  guessPlayersPerItem: Record<string, UID[]>;
  /**
   * Outcome of the round
   */
  outcome: keyof typeof WORD_LENGTH_STATUS;
  /**
   * Letter the word begins with
   */
  beginsWith: string;
  /**
   * Letter the word ends with
   */
  endsWith: string;
  /**
   * Items with the most votes
   */
  mostVotedItems: string[];
};

/**
 * State for the game over phase
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * List of player IDs who won the game
   */
  winners: string[];
  /**
   * List of achievements earned by players
   */
  achievements: Achievement[];
  /**
   * Gallery of all rounds played in the game
   */
  gallery: MetalinguagemGalleryEntry[];
};
