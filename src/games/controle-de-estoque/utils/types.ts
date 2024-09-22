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
  fulfillerId?: PlayerId;
  /**
   * The status of the order fulfillment
   */
  status: 'idle' | 'correct' | 'wrong';
  /**
   * Temporary name (letter) for the slot to be reference by the players
   */
  temporaryName: string | null;
};

export type PlaceGoodPayload = {
  goodId: string;
  newWarehouseSlot: number;
  previousWarehouseSlot?: number | null;
  concealed?: boolean;
};
