// Types
import type { Achievement, GamePlayer } from 'types/game';
// Internal
import type { CARD_TYPES, OUTCOME } from './constants';

/**
 * Distribution counts for game setup based on player count
 */
export type DataCounts = {
  /**
   * Number of agent players
   */
  agents: number;
  /**
   * Number of terrorist players
   */
  terrorists: number;
  /**
   * Number of bomb cards in the deck
   */
  bomb: number;
  /**
   * Number of wire cards in the deck
   */
  wires: number;
  /**
   * Number of blank cards in the deck
   */
  blank: number;
};

/**
 * Player's declaration about their hand contents
 */
export type Declaration = {
  /**
   * ID of the player making the declaration
   */
  playerId: UID;
  /**
   * Number of bombs declared
   */
  bombs: number;
  /**
   * Number of wires declared
   */
  wires: number;
};

/**
 * Card in the time bomb deck
 */
export type TimeBombCard = {
  /**
   * Unique identifier for the card
   */
  id: UID;
  /**
   * Type of card (bomb, wire, or blank)
   */
  type: (typeof CARD_TYPES)[keyof typeof CARD_TYPES];
};

/**
 * Target information for cutting a card
 */
export type Target = {
  /**
   * ID of the player being targeted
   */
  playerId: UID;
  /**
   * Index of the target player in the player list
   */
  playerIndex: number;
  /**
   * The card being targeted
   */
  targetCard: TimeBombCard;
  /**
   * Index of the target card in the player's hand
   */
  targetCardIndex: number;
};

/**
 * Current game status tracking active players and revealed cards
 */
export type Status = {
  /**
   * Dictionary of active player IDs (last is target, second to last is active)
   */
  activePlayerIds: Dictionary<UID | null>;
  /**
   * Dictionary of cards that have been cut
   */
  cut: Dictionary<TimeBombCard>;
  /**
   * Number of wire cards revealed so far
   */
  revealed: number;
  /**
   * Current game outcome status
   */
  outcome: (typeof OUTCOME)[keyof typeof OUTCOME];
  /**
   * Timestamp of last status update
   */
  updatedAt: number;
};

/**
 * Payload for submitting a declaration
 */
export type SubmitDeclarationPayload = {
  /**
   * The declaration being submitted
   */
  declarations: Declaration;
};

/**
 * Payload for updating the target player
 */
export type UpdateTargetPlayerPayload = {
  /**
   * ID of the player to target
   */
  targetPlayerId: UID;
};

/**
 * Payload for submitting a target selection
 */
export type SubmitTargetPayload = {
  /**
   * The target information being submitted
   */
  target: Target;
};

/**
 * State for the declaration phase where players declare bombs and wires
 */
export type PhaseDeclarationState = {
  /**
   * Distribution counts for agents, terrorists, and cards
   */
  dataCounts: DataCounts;
  /**
   * Current game status including active players, cuts, and outcome
   */
  status: Status;
};

/**
 * State for the examination phase where players cut cards
 */
export type PhaseExaminationState = {
  /**
   * Distribution counts for agents, terrorists, and cards
   */
  dataCounts: DataCounts;
  /**
   * Current game status including active players, cuts, and outcome
   */
  status: Status;
  /**
   * ID of the player being targeted for card cutting (removed when phase starts)
   */
  currentTargetPlayerId?: UID;
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * Distribution counts for agents, terrorists, and cards
   */
  dataCounts: DataCounts;
  /**
   * Final game status including active players, cuts, and outcome
   */
  status: Status;
  /**
   * List of achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
};
