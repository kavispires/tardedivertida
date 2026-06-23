// Types
import type { Achievement, GameRanking, GamePlayer } from 'types/game';
import type { CrimesHediondosCardData, CrimeSceneTileData } from 'types/tdr';

/**
 * Payload for submitting crime selection
 */
export type SubmitCrimePayload = {
  /**
   * ID of the selected weapon
   */
  weaponId?: string;
  /**
   * ID of the selected evidence
   */
  evidenceId?: string;
  /**
   * ID of the selected location
   */
  locationId?: string;
  /**
   * ID of the selected victim
   */
  victimId?: string;
  /**
   * Index for cause of death selection
   */
  causeOfDeathIndex?: number;
  /**
   * Index for reason for evidence selection
   */
  reasonForEvidenceIndex?: number;
  /**
   * Index for location selection
   */
  locationIndex?: number;
  /**
   * Index for victim selection
   */
  victimIndex?: number;
};

/**
 * Payload for marking a scene tile
 */
export type SceneTilePayload = {
  /**
   * ID of the tile being marked
   */
  tileId: string;
  /**
   * Value assigned to the tile
   */
  value: number;
};

/**
 * Payload for submitting scene marking
 */
export type SubmitMarkPayload = {
  /**
   * Index of the selected scene
   */
  sceneIndex: number;
};

/**
 * Payload for submitting guesses
 */
export type SubmitGuessesPayload = {
  /**
   * Dictionary of guesses
   */
  guesses: PlainObject;
};

/**
 * Grouped items by category
 */
export type GroupedItems = Dictionary<string[]>;

/**
 * Dictionary of items keyed by ID
 */
export type ItemsDict = Dictionary<CrimesHediondosCardData>;

/**
 * Dictionary of scenes keyed by ID
 */
export type ScenesDict = Dictionary<CrimeSceneTileData>;

/**
 * Crime configuration for a player
 */
export type Crime = {
  /**
   * ID of the player who committed this crime
   */
  playerId: UID;
  /**
   * ID of the weapon used
   */
  weaponId: string;
  /**
   * ID of the evidence left
   */
  evidenceId: string;
  /**
   * ID of the victim (optional)
   */
  victimId?: string;
  /**
   * ID of the location (optional)
   */
  locationId?: string;
  /**
   * Scene tiles and their values
   */
  scenes: Dictionary<number>;
};

/**
 * Player's guess for a crime
 */
export type Guess = {
  /**
   * ID of the guessed weapon
   */
  weaponId: string;
  /**
   * ID of the guessed evidence
   */
  evidenceId: string;
  /**
   * ID of the guessed victim (optional)
   */
  victimId?: string;
  /**
   * ID of the guessed location (optional)
   */
  locationId?: string;
  /**
   * Whether the guess is complete
   */
  isComplete?: boolean;
  /**
   * Whether there's an error in the guess
   */
  isError?: boolean;
};

/**
 * Entry in guess history
 */
export type GuessHistoryEntry = {
  /**
   * ID of the guessed weapon
   */
  weaponId: string;
  /**
   * ID of the guessed evidence
   */
  evidenceId: string;
  /**
   * ID of the guessed victim (optional)
   */
  victimId?: string;
  /**
   * ID of the guessed location (optional)
   */
  locationId?: string;
  /**
   * Status of the guess
   */
  status: string;
  /**
   * Group index of the guess
   */
  groupIndex: number;
};

/**
 * History of guesses by player
 */
export type History = {
  [key: string]: GuessHistoryEntry[];
};

/**
 * Results dictionary
 */
export type Results = {
  [key: string]: Dictionary<string>;
};

/**
 * State for the crime selection phase where players choose their crime components
 */
export type PhaseCrimeSelectionState = {
  /**
   * Cause of death scene tile
   */
  causeOfDeathTile: CrimeSceneTileData;
  /**
   * Reason for evidence scene tile
   */
  reasonForEvidenceTile: CrimeSceneTileData;
  /**
   * Location scene tile
   */
  locationTile: CrimeSceneTileData;
  /**
   * Victim scene tile
   */
  victimTile: CrimeSceneTileData;
  /**
   * Dictionary of all items in the game
   */
  items: Dictionary<CrimesHediondosCardData>;
  /**
   * Items grouped by category
   */
  groupedItems: GroupedItems;
};

/**
 * State for the scene marking phase where players mark scene tiles
 */
export type PhaseSceneMarkingState = {
  /**
   * Array of all crimes committed
   */
  crimes: Crime[];
  /**
   * Dictionary of all items in the game
   */
  items: Dictionary<CrimesHediondosCardData>;
  /**
   * Items grouped by category
   */
  groupedItems: GroupedItems;
  /**
   * Dictionary of all scene tiles
   */
  scenes: Dictionary<CrimeSceneTileData>;
  /**
   * Order of scene tile IDs
   */
  scenesOrder: string[];
  /**
   * Current scene tile being marked
   */
  currentScene: CrimeSceneTileData;
};

/**
 * State for the guessing phase where players guess crimes
 */
export type PhaseGuessingState = {
  /**
   * Array of all crimes committed
   */
  crimes: Crime[];
  /**
   * Items grouped by category
   */
  groupedItems: GroupedItems;
  /**
   * Dictionary of all items in the game
   */
  items: Dictionary<CrimesHediondosCardData>;
  /**
   * Dictionary of all scene tiles
   */
  scenes: Dictionary<CrimeSceneTileData>;
  /**
   * Order of scene tile IDs
   */
  scenesOrder: string[];
};

/**
 * State for the reveal phase showing guess results
 */
export type PhaseRevealState = {
  /**
   * Array of all crimes committed
   */
  crimes: Crime[];
  /**
   * Items grouped by category
   */
  groupedItems: GroupedItems;
  /**
   * Dictionary of all items in the game
   */
  items: Dictionary<CrimesHediondosCardData>;
  /**
   * Dictionary of all scene tiles
   */
  scenes: Dictionary<CrimeSceneTileData>;
  /**
   * Order of scene tile IDs
   */
  scenesOrder: string[];
  /**
   * Results of guesses
   */
  results: Results;
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
  /**
   * Array of player IDs who have won
   */
  winners: UID[];
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * Array of all crimes committed
   */
  crimes: Crime[];
  /**
   * Items grouped by category
   */
  groupedItems: GroupedItems;
  /**
   * Dictionary of all items in the game
   */
  items: Dictionary<CrimesHediondosCardData>;
  /**
   * Dictionary of all scene tiles
   */
  scenes: Dictionary<CrimeSceneTileData>;
  /**
   * Order of scene tile IDs
   */
  scenesOrder: string[];
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
};
