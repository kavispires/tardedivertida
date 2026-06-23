// Types
import type { Achievement, GameRanking } from 'types/game';
import type { BossIdeaCardData } from 'types/tdr';
// Internal
import type { EVENT_TYPE, OUTCOME } from './constants';

export type Good = {
  /**
   * Good id
   */
  id: string;
  /**
   * Index position in the warehouse
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
};

export type Event = {
  actorId: UID | null;
  goodsIds: string[];
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

export type PlaceGoodPayload = {
  selectedWarehouseSlot: number;
};

export type SubmitFulfillmentPayload = {
  fulfillments: Record<string, number>; // goodId: slotId; null means skip, -1 means out-of-stock
};

export type PhaseTheWarehouseState = {
  availableGoods: UID[];
  turnOrder: TurnOrder;
  goodsDict: Dictionary<Good>;
  warehouseGrid: Dictionary<WarehouseSlot>;
};

export type PhaseGoodPlacementState = {
  availableGoods: UID[];
  bossIdea: BossIdeaCardData;
  previousBossIdea: BossIdeaCardData | null;
  supervisorId: UID;
  previousSupervisorId: UID | null;
  currentGoodId: UID;
  event: Event;
  goodsDict: Dictionary<Good>;
  status: Status;
  turnOrder: TurnOrder;
  warehouseGrid: Dictionary<WarehouseSlot>;
  selectedWarehouseSlot?: number;
};

export type PhaseFulfillmentState = {
  warehouseGrid: Dictionary<WarehouseSlot>;
  ordersLeft: number;
  reportedOutOfStockGoodIds: UID[];
  goodsDict: Dictionary<Good>;
  // Props below are only for the first round to do the packing step animation
  selectedWarehouseSlot?: number;
  status: Status;
  event: Event;
  lastBossIdea: BossIdeaCardData;
  currentGoodId: UID;
};

export type PhaseResultsState = {
  gallery: Gallery;
  ranking: GameRanking;
  goodsDict: Dictionary<Good>;
  warehouseGrid: Dictionary<WarehouseSlot>;
  ordersLeft: number;
  reportedOutOfStockGoodIds: UID[];
};

export type PhaseGameOverState = {
  goodsDict: Dictionary<Good>;
  warehouseGrid: Dictionary<WarehouseSlot>;
  achievements: Achievement[];
};
