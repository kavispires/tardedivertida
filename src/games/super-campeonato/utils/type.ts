// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';
import type { ContenderCardData, TextCardData } from 'types/tdr';

/**
 * Fighting contender in the championship
 */
export type FightingContender = {
  /**
   * ID of the player who selected this contender (or 'CPU' for table contenders)
   */
  playerId: UID | 'CPU';
  /**
   * Array of player IDs who voted for this contender
   */
  votes?: UID[];
} & Pick<ContenderCardData, 'id' | 'name' | 'description'>;

/**
 * Tier level in the championship bracket
 */
export type BracketTier = 'quarter' | 'semi' | 'final' | 'winner';

/**
 * Bracket entry with contender and voting information
 */
export type Bracket = {
  /**
   * Position in the bracket
   */
  position: number;
  /**
   * Whether this contender won their match
   */
  win?: boolean;
  /**
   * Current tier of this bracket
   */
  tier: BracketTier;
  /**
   * Array of player IDs who voted for this contender
   */
  votes: UID[];
} & FightingContender;

/**
 * Array of past battles with challenges and contenders
 */
export type PastBattles = {
  /**
   * Challenge for this battle
   */
  challenge: TextCardData;
  /**
   * Contenders who competed in this battle
   */
  contenders: FightingContender[];
}[];

/**
 * Player's bet on championship winners
 */
export type Bet = {
  /**
   * ID of contender bet to win the final
   */
  final: UID;
  /**
   * ID of contender bet to reach the semi-final
   */
  semi: UID;
  /**
   * ID of contender bet to reach the quarter-final
   */
  quarter: UID;
};

/**
 * Record of contenders by tier
 */
export type ContenderByTier = Record<BracketTier | string, Record<UID, boolean>>;

/**
 * Payload for submitting a challenge selection
 */
export type SubmitChallengePayload = {
  /**
   * ID of the selected challenge
   */
  challengeId: UID;
};

/**
 * Payload for submitting contender selection
 */
export type SubmitContendersPayload = {
  /**
   * IDs of the selected contenders
   */
  contendersIds: UID[];
};

/**
 * Payload for submitting bets
 */
export type SubmitBetsPayload = Bet;

/**
 * Payload for submitting battle votes
 */
export type SubmitBattleVotesPayload = {
  /**
   * Dictionary mapping bracket position to vote count
   */
  votes: Dictionary<number>;
};

/**
 * State for the challenge selection phase where players vote on challenges
 */
export type PhaseChallengeSelectionState = {
  /**
   * Available challenge options to vote on
   */
  challenges: TextCardData[];
  /**
   * Optional brackets (set for final round or auto-contender games)
   */
  brackets?: Bracket[];
  /**
   * Number of contenders each player needs to select
   */
  contendersPerPlayerNeeded: number;
};

/**
 * State for the contender selection phase where players select their contenders
 */
export type PhaseContendersSelectionState = {
  /**
   * The selected challenge for this round
   */
  challenge: TextCardData;
  /**
   * Optional brackets (carried from previous phase if set)
   */
  brackets?: Bracket[];
  /**
   * Number of contenders each player needs to select
   */
  contendersPerPlayerNeeded: number;
};

/**
 * State for the bets phase where players bet on winners
 */
export type PhaseBetsState = {
  /**
   * The challenge for this round
   */
  challenge: TextCardData;
  /**
   * Championship brackets with all contenders
   */
  brackets: Bracket[];
};

/**
 * State for the battle phase where players vote on contenders
 */
export type PhaseBattleState = {
  /**
   * The challenge for this round
   */
  challenge: TextCardData;
  /**
   * Championship brackets with all contenders
   */
  brackets: Bracket[];
  /**
   * Current tier being voted on
   */
  tier: BracketTier;
};

/**
 * State for the results phase showing battle outcomes
 */
export type PhaseResultsState = {
  /**
   * The challenge for this round
   */
  challenge: TextCardData;
  /**
   * Championship brackets with voting results
   */
  brackets: Bracket[];
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
};

/**
 * State for the game over phase showing final championship results
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * The final championship winner (bracket entry at position 14)
   */
  finalWinner: Bracket;
  /**
   * All battles from all rounds
   */
  pastBattles: PastBattles;
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
};
