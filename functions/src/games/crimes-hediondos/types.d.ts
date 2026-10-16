// Types
import type { CrimeSceneTileData, CrimesHediondosCardData } from '../../types/tdr';
import type { CRIMES_HEDIONDOS_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `crimes-hediondos` session.
 */
export type CrimesHediondosOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * Adds bots with 2 crimes
   */
  withBots?: boolean;
  /**
   * Adds locations to game
   */
  withLocations?: boolean;
  /**
   * Adds victims to game
   */
  withVictims?: boolean;
};

/**
 * A player's secret crime, scene answers, and item group.
 */
export interface Crime {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * Identifier of the selected crime weapon.
   */
  weaponId: string;
  /**
   * Identifier of the selected crime evidence.
   */
  evidenceId: string;
  /**
   * Identifier of the selected crime victim.
   */
  victimId?: string;
  /**
   * Identifier of the location associated with this entry.
   */
  locationId?: string;
  /**
   * Scene tiles or selected scene-option indices associated with the crime.
   */
  scenes: {
    /**
     * Selected option indices indexed by scene identifier.
     */
    [key: string]: number;
  };
  /**
   * The table-group index containing the crime's items.
   */
  itemGroupIndex: number;
}

/**
 * A submitted guess for the game's hidden answer or target.
 */
export type Guess = {
  /**
   * Identifier of the selected crime weapon.
   */
  weaponId: string;
  /**
   * Identifier of the selected crime evidence.
   */
  evidenceId: string;
  /**
   * Identifier of the selected crime victim.
   */
  victimId?: string;
  /**
   * Identifier of the location associated with this entry.
   */
  locationId?: string;
};

/**
 * Crime guesses grouped by the crime owner's player identifier.
 */
export type Guesses = Record<UID, Guess>;

/**
 * Past guesses grouped by the crime owner's player identifier.
 */
export type GuessHistory = {
  /**
   * Guess attempts indexed by the crime owner's player identifier.
   */
  [key: string]: GuessHistoryEntry[];
};

/**
 * A crime guess annotated with feedback and the guessed item group.
 */
export type GuessHistoryEntry = {
  /**
   * Identifier of the selected crime weapon.
   */
  weaponId: string;
  /**
   * Identifier of the selected crime evidence.
   */
  evidenceId: string;
  /**
   * Identifier of the selected crime victim.
   */
  victimId?: string;
  /**
   * Identifier of the location associated with this entry.
   */
  locationId?: string;
  /**
   * The feedback classification assigned to this crime guess.
   */
  status: string;
  /**
   * The item-group index associated with this guess.
   */
  groupIndex: number;
};

/**
 * Item identifiers grouped by their crime-table group index.
 */
export type GroupedItems = Dictionary<string[]>;

/**
 * Incorrectly guessed group indices retained for each player or crime.
 */
export type WrongGroups = Dictionary<number[]>;

/**
 * Incorrectly guessed item identifiers retained for each player or crime.
 */
export type WrongItems = Dictionary<string[]>;

/**
 * Weapon, evidence, optional victim and location, and scene resources for crime setup.
 */
export interface ResourceData {
  /**
   * Weapon-card resources available for crime creation.
   */
  weapons: CrimesHediondosCardData[];
  /**
   * Evidence-card resources available for crime creation.
   */
  evidence: CrimesHediondosCardData[];
  /**
   * Location resources available for game setup.
   */
  locations?: CrimesHediondosCardData[];
  /**
   * Victim-card resources available for crime creation.
   */
  victims?: CrimesHediondosCardData[];
  /**
   * The complete scene-tile resources available for selection.
   */
  allScenes: CrimeSceneTileData[];
}

/**
 * Server-side data retained between phases of a `crimes-hediondos` session.
 */
export interface CrimesHediondosStore extends DefaultStore {
  /**
   * Scene tiles or selected scene-option indices associated with the crime.
   */
  scenes: CrimeSceneTileData[];
}

/**
 * Public game state shared with players during a `crimes-hediondos` session.
 */
export interface CrimesHediondosState extends DefaultState {
  /**
   * Scene tiles or selected scene-option indices associated with the crime.
   */
  scenes?: {
    /**
     * Scene tiles indexed by their identifier.
     */
    [key: string]: CrimeSceneTileData;
  };
}

/**
 * The initial metadata, server-side store, and public state for a `crimes-hediondos` session.
 */
export interface CrimesHediondosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: CrimesHediondosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: CrimesHediondosState;
}

/**
 * Player action payload accepted by the `crimes-hediondos` engine.
 */
export interface CrimesHediondosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof CRIMES_HEDIONDOS_ACTIONS;
}

/**
 * Firestore document data used when reading the `crimes-hediondos` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | CrimesHediondosState;
/**
 * Firestore document data used when reading the `crimes-hediondos` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | CrimesHediondosStore;
