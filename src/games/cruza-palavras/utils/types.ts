// Types
import type { Achievement, GameRanking, GamePlayer } from 'types/game';
import type { TextCard } from 'types/tdr';

/**
 * A clue written by a player for a specific coordinate
 */
export type Clue = {
  /**
   * The grid coordinate this clue is for
   */
  coordinate: number;
  /**
   * The clue text written by the player
   */
  clue: string;
  /**
   * ID of the player who wrote this clue
   */
  playerId?: UID;
};

/**
 * A single cell in the crossword grid
 */
export type GridCell = {
  /**
   * Unique identifier for the cell content
   */
  id?: string;
  /**
   * Position index in the grid
   */
  index: number;
  /**
   * Type of cell content
   */
  kind: string;
  /**
   * The word or text in this cell
   */
  text: string;
  /**
   * Whether this cell is available for use
   */
  available: boolean;
  /**
   * Whether players can write clues for this cell
   */
  writable?: boolean;
  /**
   * ID of the player who guessed or is assigned to this cell
   */
  playerId?: UID | null;
  /**
   * Clue text for horizontal direction
   */
  xText?: string;
  /**
   * Clue text for vertical direction
   */
  yText?: string;
  /**
   * Horizontal coordinate for clues
   */
  x?: number;
  /**
   * Vertical coordinate for clues
   */
  y?: number;
};

/**
 * Array of grid cells forming the crossword puzzle
 */
export type Grid = GridCell[];

/**
 * Type of content used in the grid
 */
export type GridType = 'words' | 'contenders' | 'images' | 'items';

/**
 * A coordinate assigned to a player for writing clues
 */
export type PlayerCoordinate = {
  /**
   * The coordinate number
   */
  coordinate: number;
  /**
   * Horizontal position
   */
  x: number;
  /**
   * Vertical position
   */
  y: number;
  /**
   * Whether this coordinate has been used
   */
  used: boolean;
};

/**
 * Player's guess result for a cell
 */
export type ResultPlayerCell = {
  /**
   * ID of the player who made the guess
   */
  playerId: UID;
  /**
   * Whether the guess was correct
   */
  isCorrect?: boolean;
  /**
   * Color associated with the player
   */
  color?: string;
};

/**
 * Payload for submitting word selections
 */
export type SubmitWordsPayload = {
  /**
   * Array of selected words
   */
  words: string[];
};

/**
 * Payload for submitting a clue
 */
export type SubmitCluePayload = {
  /**
   * The clue text
   */
  clue: string;
  /**
   * The coordinate this clue is for
   */
  currentClueCoordinate: number;
};

/**
 * Payload for submitting guesses
 */
export type SubmitGuessesPayload = {
  /**
   * Dictionary of coordinate to guessed word
   */
  guesses: PlainObject;
  /**
   * Whether the player used auto-fill
   */
  choseRandomly: boolean;
};

/**
 * Text card with an optional type field
 */
/**
 * Text card with an optional type field
 */
export type TextCardWithType = TextCard & { type?: string };

/**
 * Phase state for the words selection phase
 * Includes PhaseProps from src/types/game.ts
 */
export type PhaseWordsSelectionState = {
  /**
   * Available cards for selection
   */
  deck: TextCardWithType[];
  /**
   * Type of content used in the grid
   */
  gameType: GridType;
  /**
   * Size of the grid (number of coordinates)
   */
  gridSize: number;
};

/**
 * Phase state for the clue writing phase
 * Includes PhaseProps from src/types/game.ts
 */
export type PhaseClueWritingState = {
  /**
   * Type of content used in the grid
   */
  gameType: GridType;
  /**
   * The crossword grid with assigned coordinates
   */
  grid: Grid;
  /**
   * Size of the grid (number of coordinates)
   */
  gridSize: number;
};

/**
 * Phase state for the guessing phase
 * Includes PhaseProps from src/types/game.ts
 */
export type PhaseGuessingState = {
  /**
   * All clues written by players
   */
  clues: Clue[];
  /**
   * Type of content used in the grid
   */
  gameType: GridType;
  /**
   * The crossword grid
   */
  grid: Grid;
  /**
   * Size of the grid (number of coordinates)
   */
  gridSize: number;
};

/**
 * Phase state for the reveal phase showing results
 * Includes PhaseProps from src/types/game.ts
 */
export type PhaseRevealState = {
  /**
   * All clues written by players
   */
  clues: Clue[];
  /**
   * Type of content used in the grid
   */
  gameType: GridType;
  /**
   * The crossword grid with guesses marked
   */
  grid: Grid;
  /**
   * Size of the grid (number of coordinates)
   */
  gridSize: number;
  /**
   * Ranking showing score changes for each player
   */
  ranking: GameRanking;
  /**
   * Player IDs who scored no points this round
   */
  whoGotNoPoints: UID[];
};

/**
 * Phase state for the game over phase showing final results
 * Includes PhaseProps from src/types/game.ts
 */
export type PhaseGameOverState = {
  /**
   * Achievements earned by players during the game
   */
  achievements: Achievement[];
  /**
   * Type of content used in the grid
   */
  gameType: GridType;
  /**
   * The final crossword grid
   */
  grid: Grid;
  /**
   * Size of the grid (number of coordinates)
   */
  gridSize: number;
  /**
   * Players who won the game
   */
  winners: GamePlayer[];
};
