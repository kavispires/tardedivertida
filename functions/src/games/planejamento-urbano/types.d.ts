// Types
import type { GridMapType } from '../../tool-kits/grid-map';
import type { CityLocationData } from '../../types/tdr';
import type { PLANEJAMENTO_URBANO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `planejamento-urbano` session.
 */
export type PlanejamentoUrbanoOptions = {
  /**
   * If nsfw topics are allowed
   */
  nsfw: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * City-location resources indexed by identifier.
   */
  allCityLocations: Dictionary<CityLocationData>;
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * Identifier of the location associated with this entry.
   */
  locationId: string;
  /**
   * Identifier of the architect who proposed the location.
   */
  architectId: string;
  /**
   * Identifier of the construction cone associated with the placement.
   */
  coneId: string;
  /**
   * Identifier of the architect's intended city cell.
   */
  correctCellId: string;
  /**
   * Identifiers of players whose guesses were correct.
   */
  correctPlayersIds: UID[];
  /**
   * Player identifiers grouped by their selected answer.
   */
  playersSay: Dictionary<UID[]>;
  /**
   * Points awarded to each guessing player.
   */
  playersPoints: Record<UID, number>;
  /**
   * Points awarded to the architect for this location.
   */
  architectPoints: number;
  /**
   * Identifier of the cell where the location is ultimately placed.
   */
  finalCellId: string;
};

/**
 * Server-side data retained between phases of a `planejamento-urbano` session.
 */
export interface PlanejamentoUrbanoStore extends DefaultStore<PlanejamentoUrbanoOptions> {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: UID[];
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * A city location placed or proposed at a construction-cone position.
 */
export type Construction = {
  /**
   * Identifier of the location associated with this entry.
   */
  locationId: string;
  /**
   * Identifier of the construction cone associated with the placement.
   */
  coneId?: string;
};

/**
 * A construction marker optionally associated with a proposed city location.
 */
export type Cone = {
  /**
   * Identifier of the construction cone associated with the placement.
   */
  coneId: string;
  /**
   * Identifier of the location associated with this entry.
   */
  locationId?: string;
};

/**
 * The city grid containing construction locations, cones, and empty cells.
 */
export type City = GridMapType<Construction | Cone | null>;

/**
 * Public game state shared with players during a `planejamento-urbano` session.
 */
export interface PlanejamentoUrbanoState extends DefaultState {
  // placements?: number;
  // cityLocationsDict?: Dictionary<CityLocationData>;
  // city?: Site[];
  // gameOrder?: UID[];
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `planejamento-urbano` session.
 */
export interface PlanejamentoUrbanoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: PlanejamentoUrbanoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: PlanejamentoUrbanoState;
}

/**
 * Player action payload accepted by the `planejamento-urbano` engine.
 */
export interface PlanejamentoUrbanoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof PLANEJAMENTO_URBANO_ACTIONS;
}

/**
 * Firestore document data used when reading the `planejamento-urbano` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & PlanejamentoUrbanoState;
/**
 * Firestore document data used when reading the `planejamento-urbano` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & PlanejamentoUrbanoStore;
