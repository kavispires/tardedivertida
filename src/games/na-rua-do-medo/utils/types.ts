// Types
import type { Achievement, GamePlayer } from 'types/game';

/**
 * Represents a card in the street deck
 */
export type StreetCard = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * Key identifier for the card
   */
  key: string;
  /**
   * Name of the card in multiple languages
   */
  name: DualLanguageValue;
  /**
   * Type of card
   */
  type: 'horror' | 'candy' | 'jackpot';
  /**
   * Value of the card
   */
  value: number;
};

/**
 * Status of candy distribution
 */
export type CandyStatus = {
  /**
   * Remaining candy after distribution
   */
  leftover: number;
  /**
   * Amount of candy each player receives
   */
  perPlayer: number;
};

/**
 * Player decision for trick-or-treating
 */
export type Decision = 'GO_HOME' | 'CONTINUE' | 'HOME';

/**
 * Collection of candy statuses on the sidewalk
 */
export type CandySidewalk = CandyStatus[];

/**
 * Payload for submitting a player's decision
 */
export type SubmitDecisionPayload = {
  /**
   * The decision made by the player
   */
  decision: Decision;
};

// PHASE STATE TYPES

/**
 * State for the Trick or Treat phase
 * Contains PhaseProps plus additional game-specific state
 */
export type PhaseTrickOrTreatState = {
  /**
   * Cards that have been revealed on the street
   */
  street: StreetCard[];
  /**
   * The current card being revealed
   */
  currentCard: StreetCard;
  /**
   * Candy available on the sidewalk for each house
   */
  candySidewalk: CandySidewalk;
  /**
   * Total amount of candy currently on the sidewalk
   */
  totalCandyInSidewalk: number;
  /**
   * Amount of candy each player receives from the current card
   */
  candyPerPlayer: number;
  /**
   * Total candy players currently hold in their hand
   */
  candyInHand: number;
  /**
   * IDs of players who are still trick-or-treating
   */
  continuingPlayerIds: UID[];
  /**
   * IDs of players who have already gone home
   */
  alreadyAtHomePlayerIds: UID[];
  /**
   * Amount of candy that was cashed in by players going home
   */
  cashedInCandy: number;
};

/**
 * State for the Result phase
 * Contains PhaseProps plus additional game-specific state
 */
export type PhaseResultState = {
  /**
   * All cards that have been revealed on the street
   */
  street: StreetCard[];
  /**
   * Candy available on the sidewalk for each house
   */
  candySidewalk: CandySidewalk;
  /**
   * Total amount of candy currently on the sidewalk
   */
  totalCandyInSidewalk: number;
  /**
   * IDs of players who decided to go home this round
   */
  goingHomePlayerIds: UID[];
  /**
   * IDs of players who decided to continue trick-or-treating
   */
  continuingPlayerIds: UID[];
  /**
   * IDs of players who were already home from previous rounds
   */
  alreadyAtHomePlayerIds: UID[];
  /**
   * Amount of candy that was cashed in by players going home
   */
  cashedInCandy: number;
  /**
   * The current card (only present if double horror)
   */
  currentCard?: StreetCard;
  /**
   * Total candy players currently hold in their hand
   */
  candyInHand: number;
};

/**
 * State for the Street End phase
 * Contains PhaseProps plus additional game-specific state
 */
export type PhaseStreetEndState = {
  /**
   * All cards that have been revealed on the street
   */
  street: StreetCard[];
  /**
   * Candy available on the sidewalk for each house
   */
  candySidewalk: CandySidewalk;
  /**
   * Total amount of candy currently on the sidewalk
   */
  totalCandyInSidewalk: number;
  /**
   * IDs of players who decided to go home this round
   */
  goingHomePlayerIds: UID[];
  /**
   * IDs of players who decided to continue trick-or-treating
   */
  continuingPlayerIds: UID[];
  /**
   * IDs of players who were already home from previous rounds
   */
  alreadyAtHomePlayerIds: UID[];
  /**
   * Amount of candy that was cashed in by players going home
   */
  cashedInCandy: number;
  /**
   * Whether all players went home
   */
  isEverybodyHome: boolean;
  /**
   * Whether a double horror card was revealed
   */
  isDoubleHorror: boolean;
  /**
   * The current card (only present if double horror)
   */
  currentCard?: StreetCard;
  /**
   * Total candy players currently hold in their hand
   */
  candyInHand: number;
};

/**
 * State for the Game Over phase
 * Contains PhaseProps plus additional game-specific state
 * Note: This phase uses 'set' instead of 'update', so it's not cumulative
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: DateMilliseconds;
  /**
   * IDs of the winning players
   */
  winners: GamePlayer[];
  /**
   * List of achievements earned during the game
   */
  achievements: Achievement[];
};
