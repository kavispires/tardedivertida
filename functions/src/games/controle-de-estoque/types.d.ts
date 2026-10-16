// Types
import type { BossIdeaCardData } from '../../types/tdr';
import type { CONTROLE_DE_ESTOQUE_ACTIONS, EVENT_TYPE, OUTCOME } from './constants';

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Boss-idea configurations available for warehouse rounds.
   */
  allBossIdeas: Dictionary<BossIdeaCardData>;
  /**
   * Identifiers of the warehouse goods involved.
   */
  goodsIds: string[];
};

/**
 * A warehouse good with its stock location, orientation, and fulfillment state.
 */
export type Good = {
  /**
   * Good id
   */
  id: string;
  /**
   * Index position in the warehouse (null means out of stock)
   */
  slot: number | null;
  /**
   * Orientation of the good in the warehouse, in degrees (0, 90, 180, 270)
   */
  orientation: 0 | 90 | 180 | 270;
  /**
   * If the good is revealed or boxed
   */
  exposed: boolean;
  /**
   * The id of the player who resolved this good correctly (fulfilled the order or correctly reported as out of stock)
   */
  fulfilledId?: UID | null;
};

/**
 * A warehouse grid slot with its contents and placement availability.
 */
export type WarehouseSlot = {
  /**
   * Warehouse slot index id
   */
  id: number;
  /**
   * Good id
   */
  goodId: string | null;
  /**
   * If there is an amenity in the slot (blocking it)
   */
  amenityId?: string;
  /**
   * True if any good is placed in an adjacent slot or it is the center slot
   * OR during a special rule like WALLS
   */
  available: boolean;
  /**
   * When a order is placed here
   */
  orderId: string | null;
  /**
   * The player who fulfilled the order
   */
  fulfillerId?: UID;
  /**
   * The status of the order fulfillment
   */
  status: 'idle' | 'correct' | 'wrong';
  /**
   * Temporary name (letter) for the slot to be reference by the players
   */
  temporaryName: string | null;
};

/**
 * Progress and outcome information for the current game step.
 */
export type Status = {
  /**
   * The outcome of the current step
   */
  outcome: ValueOf<typeof OUTCOME>;
  /**
   * Number of goods currently stocked in the warehouse in the current round
   */
  progress: number;
  /**
   * Goal number of goods to be stocked in the current round
   */
  goal: number;
  /**
   * Total number of goods stocked in the warehouse
   */
  stocked: number;
  /**
   * Total number of goods to be handled in the game
   */
  total: number;
  /**
   * Additional info to be used in specific outcomes
   */
  additionalInfo?: string;
};

/**
 * The acting player and goods involved in a warehouse event.
 */
export type Event = {
  /**
   * Identifier of the player performing the action, or null when no player acts.
   */
  actorId: UID | null;
  /**
   * Identifiers of the warehouse goods involved.
   */
  goodsIds: string[]; //
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: ValueOf<typeof EVENT_TYPE>;
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: string;
  /**
   * Identifier of the warehouse order being evaluated.
   */
  orderId: string;
  /**
   * The fulfillment outcome assigned to this order.
   */
  result: 'correct' | 'out-of-stock' | 'wrong-slot' | 'wrong-out-of-stock' | 'skipped';
  /**
   * The warehouse slot selected by the player, or null for an out-of-stock answer.
   */
  guessedSlot: number | null; // Where good actually is
};

/**
 * Order-fulfillment results grouped by outcome and player.
 */
export type Gallery = {
  /**
   * Correctly fulfilled orders grouped by player identifier.
   */
  fulfilledOrders: Record<UID, GalleryEntry[]>; // playerId -> list of fulfilled orders
  /**
   * Correct out-of-stock declarations grouped by player identifier.
   */
  outOfStockOrders: Record<UID, GalleryEntry[]>; // playerId -> list of out-of-stock skipped orders
  /**
   * Incorrect slot selections grouped by player identifier.
   */
  wrongFulfillments: Record<UID, GalleryEntry[]>; // playerId -> list of wrong fulfillments
  /**
   * Incorrect out-of-stock declarations grouped by player identifier.
   */
  wrongOutOfStockOrders: Record<UID, GalleryEntry[]>; // playerId -> list of wrong out-of-stock claims
  /**
   * Skipped orders grouped by player identifier.
   */
  skippedOrders: Record<UID, GalleryEntry[]>; // playerId -> list of skipped orders
};

/**
 * Server-side data retained between phases of a `controle-de-estoque` session.
 */
export interface ControleDeEstoqueStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `controle-de-estoque` session.
 */
export interface ControleDeEstoqueState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `controle-de-estoque` session.
 */
export interface ControleDeEstoqueInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: ControleDeEstoqueStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: ControleDeEstoqueState;
}

/**
 * Player action payload accepted by the `controle-de-estoque` engine.
 */
export interface ControleDeEstoqueSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof CONTROLE_DE_ESTOQUE_ACTIONS;
}

/**
 * Firestore document data used when reading the `controle-de-estoque` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & ControleDeEstoqueState;
/**
 * Firestore document data used when reading the `controle-de-estoque` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ControleDeEstoqueStore;
