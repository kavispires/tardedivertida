// Types
import type { Achievement, GameRanking } from 'types/game';
import type { TextCard } from 'types/tdr';

export type ImageCardObj = {
  id: string;
  used: boolean;
};

export type SubmitWordPayload = {
  wordId: string;
};

export type SubmitCardsPayload = {
  cardsIds: string[];
};

export type PlayCardPayload = {
  cardId: string;
};

export type LatestInfo = {
  cardId: string;
  completedPlayers: UID[];
  matchCount: number;
  matchedPlayers: UID[];
  cardsLeft: number;
  isPhaseOver?: boolean;
};

export type CardInHand = {
  used: boolean;
  score: number;
  matchedPlayers: UID[];
  cardId: UID;
};

export type ImageCardMatch = {
  id: UID;
  used: boolean;
  text: string;
  matchedPlayers: UID[];
};

/**
 * Phase: WORD_SELECTION
 */
export type PhaseWordSelectionState = {
  /**
   * Array of image cards on the table
   */
  table: ImageCardObj[];
  /**
   * ID of the current scout player
   */
  scoutId: UID;
  /**
   * Available word options for selection
   */
  words: TextCard[];
  /**
   * Minimum number of cards that must be selected
   */
  minimumSelection: number;
};

/**
 * Phase: DREAMS_SELECTION
 */
export type PhaseDreamsSelectionState = {
  /**
   * Array of image cards on the table
   */
  table: ImageCardObj[];
  /**
   * ID of the current scout player
   */
  scoutId: UID;
  /**
   * Minimum number of cards that must be selected
   */
  minimumSelection: number;
  /**
   * The selected word for this round
   */
  word: TextCard;
};

/**
 * Phase: CARD_PLAY
 */
export type PhaseCardPlayState = {
  /**
   * Array of image cards on the table
   */
  table: ImageCardObj[];
  /**
   * ID of the current scout player
   */
  scoutId: UID;
  /**
   * Minimum number of cards that must be selected
   */
  minimumSelection: number;
  /**
   * The selected word for this round
   */
  word: TextCard;
  /**
   * ID of the currently active player
   */
  activePlayerId: string;
  /**
   * ID of the player in nightmare (if any)
   */
  playerInNightmareId?: string;
  /**
   * Current turn count
   */
  turnCount: number;
  /**
   * Game order of players
   */
  gameOrder: UID[];
  /**
   * Latest card play information
   */
  latest?: LatestInfo;
  /**
   * ID of the last active player
   */
  lastActivePlayerId?: UID;
};

/**
 * Phase: RESOLUTION
 */
export type PhaseResolutionState = {
  /**
   * Array of image cards on the table
   */
  table: ImageCardObj[];
  /**
   * ID of the current scout player
   */
  scoutId: UID;
  /**
   * Minimum number of cards that must be selected
   */
  minimumSelection: number;
  /**
   * The selected word for this round
   */
  word: TextCard;
  /**
   * ID of the player in nightmare (if any)
   */
  playerInNightmareId?: string;
  /**
   * Ranking of players for this round
   */
  ranking: GameRanking;
};

/**
 * Phase: GAME_OVER
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winner player IDs
   */
  winners: UID[];
  /**
   * Best matched cards throughout the game
   */
  bestMatches: ImageCardMatch[];
  /**
   * All image cards from the table deck
   */
  table: ImageCardObj[];
  /**
   * Achievements earned by players
   */
  achievements: Achievement[];
};
