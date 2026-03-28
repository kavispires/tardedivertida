// Types
import type { Achievement, GamePlayer, GameRanking, GameRound } from 'types/game';
import type { TextCard } from 'types/tdr';

export type SubmitRobotCardsPayload = {
  cardIds: UID[];
};

export type SubmitRobotGuessPayload = {
  guess: UID[];
};

/**
 * Robot state tracking points and goals
 */
export type Robot = {
  /**
   * Current points earned by the robot
   */
  points: number;
  /**
   * Goal points the robot needs to reach to win
   */
  goal: number;
  /**
   * Current state of the robot
   */
  state: number;
  /**
   * Number of times the robot has been beaten
   */
  beat: number;
};

/**
 * Captcha challenge for a round
 */
export type Captcha = {
  /**
   * Round number
   */
  round: number;
  /**
   * Type of round (colors, emotions, words, emojis, glyphs, warehouse-goods)
   */
  roundType: string;
  /**
   * Values to display in the captcha challenge
   */
  values: TextCard | number | number[] | string[];
};

/**
 * Captcha card option (player or bot card)
 */
export type CaptchaCard = {
  /**
   * Card ID
   */
  id: UID;
  /**
   * Players who selected this card
   */
  players: UID[];
  /**
   * Whether this card belongs to the bot
   */
  bot: boolean;
  /**
   * Player ID who submitted this card (if not a bot card)
   */
  playerId?: UID;
};

/**
 * Gallery entry for a completed round
 */
export type RobotGalleryEntry = {
  /**
   * Available options (cards) for selection
   */
  options: CaptchaCard[];
  /**
   * Outcome of the round
   */
  outcome: string;
  /**
   * Players who beat the robot this round
   */
  beaters: UID[];
  /**
   * Maximum beat score
   */
  score: number;
  /**
   * Maximum suspicion level
   */
  suspicion: number;
} & Captcha;

/**
 * State for the CARD_SELECTION phase
 * Players select a card to submit for the captcha challenge
 *
 * Note: Inherits PhaseProps which provides state, players, meta, and user
 */
export type PhaseCardSelectionState = {
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * Captcha challenge for this round
   */
  captcha: Captcha;
  /**
   * Robot state
   */
  robot: Robot;
  /**
   * Current game outcome status
   */
  outcome: string;
  /**
   * Number of cards each player must submit for this round
   */
  cardsQuantityToSubmit: number;
};

/**
 * State for the ARE_YOU_A_ROBOT phase
 * Players guess which cards belong to the robot
 *
 * Note: Inherits PhaseProps which provides state, players, meta, and user
 */
export type PhaseAreYouARobotState = {
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * Captcha challenge for this round
   */
  captcha: Captcha;
  /**
   * Robot state
   */
  robot: Robot;
  /**
   * Current game outcome status
   */
  outcome: string;
  /**
   * Available card options (player and bot cards)
   */
  options: Dictionary<CaptchaCard>;
  /**
   * Number of selections each player must make
   */
  selectionCount: number;
  /**
   * Number of cards each player must submit for this round
   */
  cardsQuantityToSubmit: number;
};

/**
 * State for the RESULTS phase
 * Shows results of the round and updates scores
 *
 * Note: Inherits PhaseProps which provides state, players, meta, and user
 */
export type PhaseResultsState = {
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * Robot state (updated with round results)
   */
  robot: Robot;
  /**
   * Current game outcome status (updated based on round results)
   */
  outcome: string;
  /**
   * Number of selections each player made
   */
  selectionCount: number;
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
  /**
   * Result details for this round
   */
  result: RobotGalleryEntry;
  /**
   * Number of cards each player must submit for this round
   */
  cardsQuantityToSubmit: number;
};

/**
 * State for the GAME_OVER phase
 * Final game results with winners and achievements
 *
 * Note: This phase uses 'set' instead of 'update', so it's not cumulative
 * Note: Inherits PhaseProps which provides state, players, meta, and user
 */
export type PhaseGameOverState = {
  /**
   * Current round information
   */
  round: GameRound;
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Winning players (empty array if robot wins)
   */
  winners: GamePlayer[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Gallery of all rounds played
   */
  gallery: RobotGalleryEntry[];
  /**
   * Final game outcome
   */
  outcome: string;
  /**
   * Final robot state
   */
  robot: Robot;
};
