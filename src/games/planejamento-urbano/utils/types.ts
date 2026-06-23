// Types
import type { Achievement, GameRanking, GamePlayer } from 'types/game';
import type { CityLocation } from 'types/tdr';
// Components
import type { GridMapType } from '@components/toolKits/GridMap';

/**
 * Payload for submitting planning decisions
 */
export type SubmitPlanningPayload = {
  /**
   * Dictionary mapping project IDs to cone IDs
   */
  planning: Dictionary<string>;
};

/**
 * Payload for submitting placement evaluations
 */
export type SubmitPlacingPayload = {
  /**
   * Dictionary mapping project IDs to player's guessed cone IDs
   */
  evaluations: Dictionary<string>;
};

/**
 * Construction site with a location
 */
export type Construction = {
  /**
   * ID of the city location
   */
  locationId: string;
  /**
   * Optional cone ID marking this site
   */
  coneId?: string;
};

/**
 * Cone marker for a potential construction site
 */
export type Cone = {
  /**
   * ID of the cone (A, B, C, D, etc.)
   */
  coneId: string;
  /**
   * Optional location ID if a building is placed here
   */
  locationId?: string;
};

/**
 * Grid map representing the city
 */
export type City = GridMapType<Construction | Cone | null>;

/**
 * Dictionary of city locations keyed by ID
 */
export type CityLocationsDict = Dictionary<CityLocation>;

/**
 * Gallery entry for a completed round showing placement results
 */
export type GalleryEntry = {
  /**
   * ID of the location that was placed
   */
  locationId: string;
  /**
   * ID of the architect player
   */
  architectId: string;
  /**
   * The correct cone ID for this location
   */
  coneId: string;
  /**
   * The correct cell ID where it should be placed
   */
  correctCellId: string;
  /**
   * Array of player IDs who guessed correctly
   */
  correctPlayersIds: UID[];
  /**
   * Dictionary mapping cone IDs to player IDs who guessed that cone
   */
  playersSay: Dictionary<UID[]>;
  /**
   * Points earned by each player for this location
   */
  playersPoints: Record<UID, number>;
  /**
   * Points earned by the architect for this location
   */
  architectPoints: number;
  /**
   * The final cell ID where the location was placed
   */
  finalCellId: string;
};

/**
 * State for the planning phase where the architect selects locations and places cones
 */
export type PhasePlanningState = {
  /**
   * ID of the current architect player
   */
  architectId: UID;
  /**
   * Array of available project IDs for this round
   */
  availableProjectsIds: UID[];
  /**
   * The city grid map
   */
  city: City;
  /**
   * Dictionary of all city locations in the game
   */
  cityLocationsDict: CityLocationsDict;
  /**
   * Dictionary mapping cone IDs to their cell IDs on the grid
   */
  coneCellIds: Dictionary<string>;
  /**
   * Order of players in the game
   */
  gameOrder: GameOrder;
};

/**
 * State for the placing phase where players guess where locations should be placed
 */
export type PhasePlacingState = {
  /**
   * ID of the current architect player
   */
  architectId: UID;
  /**
   * Array of available project IDs for this round
   */
  availableProjectsIds: UID[];
  /**
   * The city grid map
   */
  city: City;
  /**
   * Dictionary of all city locations in the game
   */
  cityLocationsDict: CityLocationsDict;
  /**
   * Dictionary mapping cone IDs to their cell IDs on the grid
   */
  coneCellIds: Dictionary<string>;
  /**
   * The architect's planning: mapping of project IDs to cone IDs
   */
  planning: Record<string, string>;
  /**
   * Order of players in the game
   */
  gameOrder: GameOrder;
};

/**
 * State for the resolution phase showing placement results
 */
export type PhaseResolutionState = {
  /**
   * ID of the current architect player
   */
  architectId: UID;
  /**
   * Array of available project IDs for this round
   */
  availableProjectsIds: UID[];
  /**
   * The city grid map
   */
  city: City;
  /**
   * Dictionary of all city locations in the game
   */
  cityLocationsDict: CityLocationsDict;
  /**
   * Dictionary mapping cone IDs to their cell IDs on the grid
   */
  coneCellIds: Dictionary<string>;
  /**
   * The architect's planning: mapping of project IDs to cone IDs
   */
  planning: Record<string, string>;
  /**
   * Order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * Gallery of placement results for this round
   */
  gallery: GalleryEntry[];
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
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
   * The final city grid map
   */
  city: City;
  /**
   * Dictionary of all city locations used in the game
   */
  cityLocationsDict: CityLocationsDict;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
};
