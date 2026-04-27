// Types
import type { BossIdeaCard } from 'types/tdr';
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

export type PlaceGoodPayload = {
  selectedWarehouseSlot: number;
};

export type PhaseTheWarehouseState = {
  availableGoods: UID[];
  turnOrder: TurnOrder;
  goodsDict: Dictionary<Good>;
  warehouseGrid: Dictionary<WarehouseSlot>;
};

export type PhaseGoodPlacementState = {
  availableGoods: UID[];
  bossIdea: BossIdeaCard;
  currentGoodId: UID;
  event: Event;
  goodsDict: Dictionary<Good>;
  status: Status;
  supervisorId: UID;
  turnNumber: number;
  turnOrder: TurnOrder;
  warehouseGrid: Dictionary<WarehouseSlot>;
  selectedWarehouseSlot?: number;
};
