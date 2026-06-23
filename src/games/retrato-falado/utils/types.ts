// Types
import type { Achievement, GameRanking } from 'types/game';
import type { MonsterImageData } from 'types/tdr';

/**
 * Represents a sketch submission with player and monster information
 */
export type Sketch = {
  /**
   * The sketch drawing data
   */
  sketch: string;
  /**
   * ID of the player who created the sketch
   */
  playerId: UID;
} & MonsterImageData;

/**
 * Payload for submitting monster orientation
 */
export type SubmitOrientationPayload = {
  /**
   * The orientation value for the monster
   */
  orientation: string;
};

/**
 * Payload for submitting a sketch drawing
 */
export type SubmitSketchPayload = {
  /**
   * The sketch drawing data
   */
  sketch: string;
};

/**
 * Payload for submitting a vote for a sketch
 */
export type SubmitVotePayload = {
  /**
   * ID of the player being voted for
   */
  vote: UID;
};

/**
 * State for the Composite Sketch phase
 * The witness describes the monster and players draw based on the description
 */
export type PhaseCompositeSketchState = {
  /**
   * Order of players for taking turns as witness
   */
  gameOrder: GameOrder;
  /**
   * The monster being described
   */
  currentMonster: MonsterImageData;
  /**
   * ID of the player who is the witness
   */
  witnessId: UID;
};

/**
 * State for the Evaluation phase
 * Players view all sketches and vote for the best one
 */
export type PhaseEvaluationState = {
  /**
   * Order of players for taking turns as witness
   */
  gameOrder: GameOrder;
  /**
   * The monster that was being described
   */
  currentMonster: MonsterImageData;
  /**
   * ID of the player who was the witness
   */
  witnessId: UID;
  /**
   * All sketch submissions from players
   */
  sketches: Sketch[];
};

/**
 * State for the Reveal phase
 * Shows voting results and awards points
 */
export type PhaseRevealState = {
  /**
   * Order of players for taking turns as witness
   */
  gameOrder: GameOrder;
  /**
   * The monster that was being described
   */
  currentMonster: MonsterImageData;
  /**
   * ID of the player who was the witness
   */
  witnessId: UID;
  /**
   * All sketch submissions from players
   */
  sketches: Sketch[];
  /**
   * ID of the sketch the witness voted for
   */
  witnessVote: UID;
  /**
   * IDs of players who received the most votes
   */
  mostVotes: UID[];
  /**
   * Player rankings with scores for this round
   */
  ranking: GameRanking;
  /**
   * ID of the player who was most voted (tie-breaker applied), or null if tied
   */
  mostVoted: UID | null;
  /**
   * Dictionary mapping player IDs to arrays of player IDs who voted for them
   */
  votes: Dictionary<UID[]>;
};

/**
 * State for the Game Over phase
 * Shows final results and achievements
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Gallery of selected sketches from all rounds
   */
  gallery: Sketch[];
  /**
   * IDs of the winning players
   */
  winners: UID[];
  /**
   * Achievements earned by players
   */
  achievements: Achievement[];
};
