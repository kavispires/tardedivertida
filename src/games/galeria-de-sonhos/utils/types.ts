// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';
import type { TextCardData } from 'types/tdr';

/**
 * Image card object in the game
 */
export type ImageCardObj = {
  /**
   * Unique identifier for the image card
   */
  id: string;
  /**
   * Whether the card has been used/played
   */
  used: boolean;
};

/**
 * Payload for submitting a word selection
 */
export type SubmitWordPayload = {
  /**
   * ID of the selected word
   */
  wordId: string;
};

/**
 * Payload for submitting card selections
 */
export type SubmitCardsPayload = {
  /**
   * Array of selected card IDs
   */
  cardsIds: string[];
};

/**
 * Payload for playing a card
 */
export type PlayCardPayload = {
  /**
   * ID of the card being played
   */
  cardId: string;
};

/**
 * Latest information about card play
 */
export type LatestInfo = {
  /**
   * ID of the card that was played
   */
  cardId: string;
  /**
   * Array of player IDs who have completed their turn
   */
  completedPlayers: UID[];
  /**
   * Number of matches for this card
   */
  matchCount: number;
  /**
   * Array of player IDs who matched this card
   */
  matchedPlayers: UID[];
  /**
   * Number of cards remaining to be played
   */
  cardsLeft: number;
  /**
   * Whether the phase is over
   */
  isPhaseOver?: boolean;
};

/**
 * Card in a player's hand
 */
export type CardInHand = {
  /**
   * Whether the card has been used
   */
  used: boolean;
  /**
   * Score for this card
   */
  score: number;
  /**
   * Array of player IDs who matched this card
   */
  matchedPlayers: UID[];
  /**
   * ID of the card
   */
  cardId: UID;
};

/**
 * Image card with match information
 */
export type ImageCardMatch = {
  /**
   * ID of the image card
   */
  id: UID;
  /**
   * Whether the card has been used
   */
  used: boolean;
  /**
   * Text/word associated with this card
   */
  text: string;
  /**
   * Array of player IDs who matched this card
   */
  matchedPlayers: UID[];
};

/**
 * State for the word selection phase where the scout chooses a word
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
  words: TextCardData[];
  /**
   * Minimum number of cards that must be selected
   */
  minimumSelection: number;
};

/**
 * State for the dreams selection phase where players choose cards
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
  word: TextCardData;
};

/**
 * State for the card play phase where players play their selected cards
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
  word: TextCardData;
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
 * State for the resolution phase showing round results
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
  word: TextCardData;
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
 * State for the game over phase showing final results
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
