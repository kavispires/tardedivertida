// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';
import type { TextCardData } from 'types/tdr';

/**
 * Payload for submitting selected words
 */
export type SubmitWordsPayload = {
  /**
   * Array of selected word IDs
   */
  selectedWordsIds: string[];
};

/**
 * Payload for submitting clues
 */
export type SubmitCluesPayload = {
  /**
   * Array of clues written by the player
   */
  clues: string[];
};

/**
 * Payload for submitting guesses
 */
export type SubmitGuessesPayload = {
  /**
   * Mapping of clue entry ID to array of guessed word IDs
   */
  guesses: Record<string, string[]>;
};

/**
 * Entry in the game board representing a word card
 */
export type BoardEntry = {
  /**
   * Position ID on the board
   */
  id: string;
  /**
   * Reference to the card in the deck
   */
  cardId: string;
  /**
   * Text content of the word
   */
  text: string;
  /**
   * ID of the player assigned to this word
   */
  playerId: string;
};

/**
 * Pair of words assigned to a player with their clue
 */
export type PlayerAssignedPair = {
  /**
   * Unique identifier for the pair
   */
  id: string;
  /**
   * Array of word IDs in this pair
   */
  ids: string[];
  /**
   * Clue provided for this pair
   */
  clue: string;
};

/**
 * Guessed pair with player information
 */
export type GuessedPair = PlayerAssignedPair & {
  /**
   * ID of the player who guessed
   */
  playerId: string;
  /**
   * Name of the player who guessed
   */
  playerName: string;
  /**
   * Avatar ID of the player who guessed
   */
  avatarId: string;
  /**
   * Color associated with the player
   */
  color: string;
  /**
   * Index of the guess
   */
  index: number;
  /**
   * Array of guessed word IDs
   */
  guesses: string[];
};

/**
 * Entry in the gallery showing clue results
 */
export type GalleryEntry = {
  /**
   * Unique identifier for the entry
   */
  id: string;
  /**
   * Array of word IDs in this entry
   */
  ids: string[];
  /**
   * Array of word texts
   */
  words: string[];
  /**
   * ID of the player who created the clue
   */
  playerId: UID;
  /**
   * The clue provided (null if none)
   */
  clue: string | null;
  /**
   * Array of player IDs who guessed correctly
   */
  correct: UID[];
  /**
   * Array of incorrect guesses with player information
   */
  misses: {
    /**
     * ID of the player who guessed
     */
    guesserId: UID;
    /**
     * Array of incorrect guesses
     */
    guesses: string[];
  }[];
};

/**
 * Tracks house happiness progress
 */
export type HouseHappiness = {
  /**
   * Array of happiness points gained each round
   */
  gained: number[];
  /**
   * Target happiness goal to win
   */
  goal: number;
  /**
   * Total accumulated happiness points
   */
  total: number;
};

/**
 * State for the words selection phase where players choose words from a pool
 */
export type PhaseWordsSelectionState = {
  /**
   * House happiness tracking
   */
  happiness: HouseHappiness;
  /**
   * Pool of available word cards to choose from
   */
  pool: TextCardData[];
  /**
   * Number of words required to be selected
   */
  requiredWords: number;
};

/**
 * State for the clue writing phase where players write clues for their assigned word pairs
 */
export type PhaseClueWritingState = {
  /**
   * House happiness tracking
   */
  happiness: HouseHappiness;
  /**
   * Game board with assigned words
   */
  board: BoardEntry[];
};

/**
 * State for the guessing phase where players guess word pairs based on clues
 */
export type PhaseGuessingState = {
  /**
   * House happiness tracking
   */
  happiness: HouseHappiness;
  /**
   * Game board with assigned words
   */
  board: BoardEntry[];
};

/**
 * State for the reveal phase showing guess results and rankings
 */
export type PhaseRevealState = {
  /**
   * Game board with assigned words
   */
  board: BoardEntry[];
  /**
   * Updated house happiness tracking
   */
  happiness: HouseHappiness;
  /**
   * Gallery of clue results
   */
  gallery: GalleryEntry[];
  /**
   * Player rankings for this round
   */
  ranking: GameRanking;
  /**
   * Array of player IDs who found the target item
   */
  foundTarget: UID[];
  /**
   * ID of the target item for this round
   */
  targetId: string;
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * List of achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Dictionary of purchased items by round number
   */
  purchases: Dictionary<BoardEntry>;
  /**
   * Historical gallery of all clues used (card ID to clues mapping)
   */
  gallery: Dictionary<string[]>;
  /**
   * Final house happiness tracking
   */
  happiness: HouseHappiness;
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
};
