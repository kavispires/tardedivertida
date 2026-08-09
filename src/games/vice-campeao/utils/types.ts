// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';

/**
 * Payload for submitting a card selection
 */
export type SubmitCardPayload = {
  /**
   * ID of the selected card to play
   */
  cardId: string;
  /**
   * ID of the target player
   */
  targetId: string;
};

/**
 * Card that can be played to affect runner positions
 */
export type RunnerCard = {
  /**
   * Unique identifier for the card
   */
  id: UID;
  /**
   * Image identifier for the card
   */
  imageId: string;
  /**
   * Card name in multiple languages
   */
  name: DualLanguageValue;
  /**
   * Type of movement or effect the card provides
   */
  type: 'movement-positive' | 'movement-negative' | 'movement-neutral' | 'ongoing' | 'effect' | 'random';
  /**
   * Number of copies of this card in the deck
   */
  quantity: number;
  /**
   * Card description in multiple languages
   */
  description?: DualLanguageValue;
  /**
   * Numeric value of the card's effect
   */
  value?: number;
  /**
   * Key identifying the specific trigger effect
   */
  triggerKey?: string;
  /**
   * Whether this card does not require target selection
   */
  autoTarget?: boolean;
  /**
   * Whether this card omits the target during the race
   */
  omitsTarget?: boolean;
};

/**
 * Activity entry representing a card play and its effects on runner positions
 */
export type RunActivity = {
  /**
   * Index of this activity in the race sequence
   */
  id: number;
  /**
   * ID of the card played
   */
  cardId: UID;
  /**
   * ID of the player who played the card
   */
  playerId: UID;
  /**
   * ID of the target player
   */
  targetId: UID;
  /**
   * New calculated value after card effect
   */
  newValue?: number;
  /**
   * Dictionary of player positions before this activity
   */
  startingPositions: {
    [key: string]: number;
  };
  /**
   * Dictionary of player positions after this activity
   */
  endingPositions: {
    [key: string]: number;
  };
  /**
   * ID of an ongoing effect card affecting this activity
   */
  ongoingEffectCardId?: UID;
};

/**
 * State for the card selection phase where players choose which card to play
 */
export type PhaseCardSelectionState = {
  /**
   * Dictionary of all runner cards
   */
  cardsDict: Dictionary<RunnerCard>;
  /**
   * Order of player turns
   */
  turnOrder: UID[];
  /**
   * Current race activities for this round
   */
  race: RunActivity[];
};

/**
 * State for the run phase showing the results of all cards played
 */
export type PhaseRunState = {
  /**
   * Dictionary of all runner cards
   */
  cardsDict: Dictionary<RunnerCard>;
  /**
   * Order of player turns
   */
  turnOrder: UID[];
  /**
   * All race activities for this round
   */
  race: RunActivity[];
  /**
   * Current player ranking
   */
  ranking: GameRanking;
  /**
   * Array of player IDs who are frozen/locked
   */
  lockedPlayersIds: UID[];
  /**
   * Array of player IDs with ongoing +1 effects
   */
  ongoingPlusOnePlayersIds: UID[];
  /**
   * Array of player IDs with ongoing -1 effects
   */
  ongoingMinusOnePlayersIds: UID[];
};

/**
 * State for the game over phase showing final results and full race replay
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players (second place finishers)
   */
  winners: GamePlayer[];
  /**
   * Dictionary of all runner cards
   */
  cardsDict: Dictionary<RunnerCard>;
  /**
   * Complete replay of all race activities
   */
  replay: RunActivity[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
};
