// Types
import type { BossIdeaCardData } from '../../types/tdr';
import type { CONTROLE_DE_ESTOQUE_ACTIONS, EVENT_TYPE, OUTCOME } from './constants';

export type ResourceData = {
  allBossIdeas: Dictionary<BossIdeaCardData>;
  goodsIds: string[];
};

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

export type Event = {
  actorId: UID | null;
  goodsIds: string[]; //
  type: ValueOf<typeof EVENT_TYPE>;
};

export type GalleryEntry = {
  playerId: string;
  orderId: string;
  result: 'correct' | 'out-of-stock' | 'wrong-slot' | 'wrong-out-of-stock' | 'skipped';
  guessedSlot: number | null; // Where good actually is
};

export type Gallery = {
  fulfilledOrders: Record<UID, GalleryEntry[]>; // playerId -> list of fulfilled orders
  outOfStockOrders: Record<UID, GalleryEntry[]>; // playerId -> list of out-of-stock skipped orders
  wrongFulfillments: Record<UID, GalleryEntry[]>; // playerId -> list of wrong fulfillments
  wrongOutOfStockOrders: Record<UID, GalleryEntry[]>; // playerId -> list of wrong out-of-stock claims
  skippedOrders: Record<UID, GalleryEntry[]>; // playerId -> list of skipped orders
};

export interface ControleDeEstoqueStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ControleDeEstoqueState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ControleDeEstoqueInitialState extends InitialState {
  store: ControleDeEstoqueStore;
  state: ControleDeEstoqueState;
}

export interface ControleDeEstoqueSubmitAction extends Payload {
  action: keyof typeof CONTROLE_DE_ESTOQUE_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & ControleDeEstoqueState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ControleDeEstoqueStore;
