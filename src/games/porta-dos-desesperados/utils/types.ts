// Types
import type { Achievement, GamePlayer } from 'types/game';
// Internal
import type { TRAPS } from './constants';

export type DoorsCache = {
  doors: number[];
};

/**
 * Payload for submitting selected book pages
 */
export type SubmitPagesPayload = {
  /**
   * Array of selected page IDs
   */
  pageIds: UID[];
};

/**
 * Payload for submitting a door choice
 */
export type SubmitDoorPayload = {
  /**
   * ID of the selected door
   */
  doorId: UID;
  /**
   * Whether the player is ready to proceed
   */
  ready?: boolean;
};

/**
 * Type of trap active in the current corridor
 */
export type Trap = keyof typeof TRAPS;

/**
 * Detailed information about a trap
 */
export type TrapEntry = {
  /**
   * Unique identifier for the trap
   */
  id: string;
  /**
   * Where the trap is implemented
   */
  setup: 'backend' | 'frontend' | 'fullstack';
  /**
   * Difficulty level of the trap
   */
  level: number;
  /**
   * What phase the trap affects
   */
  target: 'clue' | 'guess' | 'all';
  /**
   * Internal note about the trap
   */
  note: string;
  /**
   * Icon identifier for the trap
   */
  icon:
    | 'dreamCatcher'
    | 'magicCandles'
    | 'magicDivination'
    | 'magicHamsa'
    | 'magicRunes'
    | 'magicTarotCards'
    | 'magicVoodooDoll';
  /**
   * Trap title in multiple languages
   */
  title: DualLanguageValue;
  /**
   * Trap description in multiple languages
   */
  description: DualLanguageValue;
};

/**
 * State for the book possession phase where the possessed player selects pages
 */
export type PhaseBookPossessionState = {
  /**
   * Order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * Remaining magic units
   */
  magic: number;
  /**
   * Current corridor level (1-5)
   */
  currentCorridor: number;
  /**
   * Overall game difficulty based on traps
   */
  difficulty: number;
  /**
   * ID of the possessed player
   */
  possessedId: UID;
  /**
   * Current trap affecting this corridor
   */
  trap: Trap | 'NONE';
  /**
   * Available book page IDs for selection
   */
  pages: string[];
  /**
   * Available door IDs to choose from
   */
  doors: UID[];
  /**
   * The correct door ID for this corridor
   */
  answerDoorId: UID;
  /**
   * Detailed information about the current trap
   */
  trapEntry: TrapEntry | null;
};

/**
 * State for the door choice phase where players select which door to open
 */
export type PhaseDoorChoiceState = {
  /**
   * Order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * Remaining magic units
   */
  magic: number;
  /**
   * Current corridor level (1-5)
   */
  currentCorridor: number;
  /**
   * Overall game difficulty based on traps
   */
  difficulty: number;
  /**
   * ID of the possessed player
   */
  possessedId: UID;
  /**
   * Current trap affecting this corridor
   */
  trap: Trap | 'NONE';
  /**
   * Available book page IDs for selection
   */
  pages: string[];
  /**
   * Available door IDs to choose from
   */
  doors: UID[];
  /**
   * The correct door ID for this corridor
   */
  answerDoorId: UID;
  /**
   * Detailed information about the current trap
   */
  trapEntry: TrapEntry | null;
  /**
   * IDs of pages selected by the possessed player
   */
  selectedPagesIds: string[];
};

/**
 * State for the resolution phase showing results of door choices
 */
export type PhaseResolutionState = {
  /**
   * Order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * Remaining magic units after this round
   */
  magic: number;
  /**
   * Current corridor level (1-5)
   */
  currentCorridor: number;
  /**
   * Overall game difficulty based on traps
   */
  difficulty: number;
  /**
   * ID of the possessed player
   */
  possessedId: UID;
  /**
   * Current trap affecting this corridor
   */
  trap: Trap | 'NONE';
  /**
   * Available book page IDs for selection
   */
  pages: string[];
  /**
   * Available door IDs to choose from
   */
  doors: UID[];
  /**
   * The correct door ID for this corridor
   */
  answerDoorId: UID;
  /**
   * Detailed information about the current trap
   */
  trapEntry: TrapEntry | null;
  /**
   * IDs of pages selected by the possessed player
   */
  selectedPagesIds: string[];
  /**
   * Outcome of this round (SUCCESS or FAIL)
   */
  outcome: string;
  /**
   * Current win condition status
   */
  winCondition: string;
  /**
   * Number of magic units used this round
   */
  usedMagic: number;
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Array of winning players (empty if players lost)
   */
  winners: GamePlayer[];
  /**
   * Final win condition (WIN or LOSE)
   */
  winCondition: string;
  /**
   * Final corridor level reached
   */
  currentCorridor: number;
  /**
   * Remaining magic units at game end
   */
  magic: number;
  /**
   * IDs of all doors successfully opened
   */
  doors: UID[];
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
};
