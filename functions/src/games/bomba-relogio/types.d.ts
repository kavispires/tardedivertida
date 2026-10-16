// Types
import type { BOMBA_RELOGIO_ACTIONS, CARD_TYPES, OUTCOME } from './constants';
import type { Dictionary } from 'lodash';

/**
 * Role and card quantities used to configure a game for a given player count.
 */
export type DataCounts = {
  /**
   * The number of agent role cards available at this player count.
   */
  agents: number;
  /**
   * The number of terrorist role cards available at this player count.
   */
  terrorists: number;
  /**
   * The number of bomb cards in the deck.
   */
  bomb: number;
  /**
   * The number of wire cards included or declared.
   */
  wires: number;
  /**
   * The number of blank cards in the deck.
   */
  blank: number;
};

/**
 * A player's declared bomb and wire counts.
 */
export type Declaration = {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The number of bomb cards declared by the player.
   */
  bombs: number;
  /**
   * The number of wire cards included or declared.
   */
  wires: number;
};

/**
 * A uniquely identified bomb, wire, or blank card.
 */
export type TimeBombCard = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The card category: bomb, wire, or blank.
   */
  type: (typeof CARD_TYPES)[keyof typeof CARD_TYPES];
};

/**
 * The player and hand position selected for a wire-cutting attempt.
 */
export type Target = {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The target player's index in the current player order.
   */
  playerIndex: number;
  /**
   * The card selected for the cutting attempt.
   */
  targetCard: TimeBombCard;
  /**
   * The selected card's index in the target player's hand.
   */
  targetCardIndex: number;
};

/**
 * Progress and outcome information for the current game step.
 */
export type Status = {
  /**
   * Active-player history used to identify the latest target and preceding actor.
   */
  activePlayerIds: Dictionary<UID | null>; // when more than 1 value, last is target, and second to last is active
  /**
   * Cards already cut, indexed by their identifier.
   */
  cut: Dictionary<TimeBombCard>;
  /**
   * The number of cards revealed so far.
   */
  revealed: number;
  /**
   * The result used to resolve this step or advance the game.
   */
  outcome: (typeof OUTCOME)[keyof typeof OUTCOME];
  /**
   * The time this status was last updated.
   */
  updatedAt: number;
};

/**
 * Comparison between declared wires and the wires needed to complete the round.
 */
export type LieDetectorStatus = {
  /**
   * The sum of the players' declared wire counts.
   */
  totalWiresDeclared: number;
  /**
   * The number of wires needed to complete the round.
   */
  neededWires: number;
  /**
   * Whether the declarations disagree with the required wire count.
   */
  someoneIsLying: boolean;
};

/**
 * Server-side data retained between phases of a `bomba-relogio` session.
 */
export interface BombaRelogioStore extends DefaultStore<unknown> {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: TimeBombCard[];
}

/**
 * Public game state shared with players during a `bomba-relogio` session.
 */
export interface BombaRelogioState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: unknown;
}

/**
 * The initial metadata, server-side store, and public state for a `bomba-relogio` session.
 */
export interface BombaRelogioInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: BombaRelogioStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: BombaRelogioState;
}

/**
 * Player action payload accepted by the `bomba-relogio` engine.
 */
export interface BombaRelogioSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof BOMBA_RELOGIO_ACTIONS;
}

/**
 * Firestore document data used when reading the `bomba-relogio` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & BombaRelogioState;
/**
 * Firestore document data used when reading the `bomba-relogio` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & BombaRelogioStore;
