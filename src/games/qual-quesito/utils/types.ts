// Types
import type { Achievement, GameRanking, GamePlayer } from 'types/game';
import type { Item } from 'types/tdr';

/**
 * Payload for submitting a category
 */
export type SubmitCategoryPayload = {
  /**
   * The category name
   */
  category: string;
};

/**
 * Payload for skipping a turn
 */
export type SubmitSkipTurnPayload = never;

/**
 * Payload for submitting cards
 */
export type SubmitCardsPayload = {
  /**
   * IDs of the cards being submitted
   */
  cardsIds: UID[];
};

/**
 * Payload for submitting evaluations of submitted cards
 */
export type SubmitEvaluationsPayload = {
  /**
   * Dictionary mapping card IDs to whether they are accepted
   */
  evaluations: Dictionary<boolean>;
};

/**
 * Represents a card submission entry in the table
 */
export type TableEntry = {
  /**
   * ID of the player who submitted the card
   */
  playerId: UID;
  /**
   * ID of the submitted card
   */
  cardId: UID;
  /**
   * Whether the card was accepted for the category
   */
  accepted: boolean;
};

/**
 * Represents a completed round in the gallery
 */
export type GalleryEntry = {
  /**
   * The category for this round
   */
  category: string;
  /**
   * ID of the player who created the category
   */
  creatorId: UID;
  /**
   * All card submissions for this category
   */
  items: TableEntry[];
};

/**
 * State for the Category Creation phase
 * The active player creates a category for the round
 */
export type PhaseCategoryCreationState = {
  /**
   * Order of players for taking turns
   */
  turnOrder: GameOrder;
  /**
   * ID of the player creating the category
   */
  creatorId: UID;
  /**
   * Dictionary of all available cards
   */
  cardsDict: Dictionary<Item>;
};

/**
 * State for the Skip Announcement phase
 * Shows that the category creator is skipping their turn
 */
export type PhaseSkipAnnouncementState = {
  /**
   * Order of players for taking turns
   */
  turnOrder: GameOrder;
  /**
   * ID of the player who skipped creating a category
   */
  creatorId: UID;
  /**
   * Dictionary of all available cards
   */
  cardsDict: Dictionary<Item>;
};

/**
 * State for the Card Play phase
 * Players submit cards that fit the category
 */
export type PhaseCardPlayState = {
  /**
   * Order of players for taking turns
   */
  turnOrder: GameOrder;
  /**
   * ID of the player who created the category
   */
  creatorId: UID;
  /**
   * Dictionary of all available cards
   */
  cardsDict: Dictionary<Item>;
  /**
   * The category for this round
   */
  category: string;
};

/**
 * State for the Verification phase
 * The category creator evaluates submitted cards
 */
export type PhaseVerificationState = {
  /**
   * Order of players for taking turns
   */
  turnOrder: GameOrder;
  /**
   * ID of the player who created the category
   */
  creatorId: UID;
  /**
   * Dictionary of all available cards
   */
  cardsDict: Dictionary<Item>;
  /**
   * All card submissions for this round
   */
  table: TableEntry[];
  /**
   * The category for this round
   */
  category: string;
};

/**
 * State for the Results phase
 * Shows results and awards points for the round
 */
export type PhaseResultsState = {
  /**
   * Order of players for taking turns
   */
  turnOrder: GameOrder;
  /**
   * ID of the player who created the category
   */
  creatorId: UID;
  /**
   * Dictionary of all available cards
   */
  cardsDict: Dictionary<Item>;
  /**
   * All card submissions with acceptance status
   */
  table: TableEntry[];
  /**
   * Player rankings with scores for this round
   */
  ranking: GameRanking;
  /**
   * The category for this round
   */
  category: string;
  /**
   * Whether the category creator received a bonus
   */
  creatorBonus?: boolean;
};

/**
 * State for the Game Over phase
 * Shows final results and achievements
 */
export type PhaseGameOverState = {
  /**
   * Achievements earned by players
   */
  achievements: Achievement[];
  /**
   * The winning players
   */
  winners: GamePlayer[];
  /**
   * Gallery of all rounds played
   */
  gallery: GalleryEntry[];
  /**
   * Dictionary of all cards used in the game
   */
  cardsDict: Dictionary<Item>;
};
