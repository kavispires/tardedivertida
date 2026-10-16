// Types
import type { PORTA_DOS_DESESPERADOS_ACTIONS, TRAPS } from './constants';

/**
 * Configuration options used when creating a `porta-dos-desesperados` session.
 */
export type PortaDosDesesperadosOptions = {
  /**
   * Add bots to the game to go was players
   */
  withBots?: boolean;
};

/**
 * Identifier of a door trap that modifies clue creation or guessing.
 */
export type Trap = keyof typeof TRAPS;
/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards: UID[];
}

/**
 * A trap's difficulty, implementation target, presentation, and gameplay description.
 */
export type TrapEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Whether the trap is implemented in the backend, frontend, or both.
   */
  setup: 'backend' | 'frontend' | 'fullstack';
  /**
   * The difficulty level assigned to this trap.
   */
  level: number;
  /**
   * Whether the trap affects clue creation, guessing, or both.
   */
  target: 'clue' | 'guess' | 'all';
  /**
   * Implementation notes describing the trap's effect or limitations.
   */
  note: string;
  /**
   * The icon identifier used to display the trap.
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
   * The localized title displayed for this entry.
   */
  title: DualLanguageValue;
  /**
   * The localized description explaining this entry.
   */
  description: DualLanguageValue;
};

/**
 * Server-side data retained between phases of a `porta-dos-desesperados` session.
 */
export interface PortaDosDesesperadosStore extends DefaultStore {
  /**
   * Known relationships between image-card identifiers.
   */
  relationships?: ImageCardRelationship;
  /**
   * Door-card identifiers retained for the final result.
   */
  finalDoors?: UID[];
}

/**
 * Public game state shared with players during a `porta-dos-desesperados` session.
 */
export interface PortaDosDesesperadosState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Player data extended with `porta-dos-desesperados` submissions and progress.
 */
export interface PortaDosDesesperadosPlayer extends Player {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Player records indexed by player identifier for `porta-dos-desesperados`.
 */
export type PortaDosDesesperadosPlayers = Record<UID, PortaDosDesesperadosPlayer>;

/**
 * The initial metadata, server-side store, and public state for a `porta-dos-desesperados` session.
 */
export interface PortaDosDesesperadosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: PortaDosDesesperadosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: PortaDosDesesperadosState;
}

/**
 * Player action payload accepted by the `porta-dos-desesperados` engine.
 */
export interface PortaDosDesesperadosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof PORTA_DOS_DESESPERADOS_ACTIONS;
}

/**
 * Firestore document data used when reading the `porta-dos-desesperados` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & PortaDosDesesperadosState;
/**
 * Firestore document data used when reading the `porta-dos-desesperados` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & PortaDosDesesperadosStore;
/**
 * Firestore document data used when reading `porta-dos-desesperados` player records.
 */
export type FirebasePlayersData = FirebaseFirestore.DocumentData & PortaDosDesesperadosPlayers;
