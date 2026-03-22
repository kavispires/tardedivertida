// Types
import type { Achievement } from 'types/game';

/**
 * Data stored in a deck entry for image type
 */
export type DeckEntryImageData = {
  /**
   * Image ID
   */
  id: string;
  /**
   * Type identifier
   */
  type: 'image';
};

/**
 * Data stored in a deck entry for item type
 */
export type DeckEntryItemData = {
  /**
   * Item ID
   */
  id: string;
  /**
   * Item name in multiple languages
   */
  name: DualLanguageValue;
  /**
   * Type identifier
   */
  type: 'item';
};

/**
 * Data stored in a deck entry for word type
 */
export type DeckEntryWordData = {
  /**
   * Word ID
   */
  id: string;
  /**
   * Type identifier
   */
  type: 'word';
  /**
   * Word text in multiple languages
   */
  text: DualLanguageValue;
};

/**
 * Data stored in a deck entry for contender type
 */
export type DeckEntryContenderData = {
  /**
   * Contender ID
   */
  id: string;
  /**
   * Type identifier
   */
  type: 'contender';
  /**
   * Contender name in multiple languages
   */
  name: DualLanguageValue;
};

/**
 * Data stored in a deck entry for suspect type
 */
export type DeckEntrySuspectData = {
  /**
   * Suspect ID
   */
  id: string;
  /**
   * Type identifier
   */
  type: 'suspect';
  /**
   * Suspect name in multiple languages
   */
  name: DualLanguageValue;
};

/**
 * Union type for all possible deck entry data types
 */
export type DeckEntryData =
  | DeckEntryImageData
  | DeckEntryItemData
  | DeckEntryWordData
  | DeckEntryContenderData
  | DeckEntrySuspectData;

/**
 * Payload for submitting a clue request
 */
export type SubmitRequestPayload = {
  /**
   * The clue provided by the requester
   */
  clue: string;
  /**
   * The number of items requested
   */
  clueQuantity: number;
};

/**
 * Payload for submitting a delivery
 */
export type SubmitDeliveryPayload = {
  /**
   * The ID of the item being delivered
   */
  delivery: string;
};

/**
 * Represents an entry in the game deck
 */
export type DeckEntry = {
  /**
   * Unique identifier for the deck entry
   */
  id: string;
  /**
   * Affiliation for each side [sideA, sideB]
   */
  affiliation: [string, string];
  /**
   * Current status of the deck entry
   */
  status: string;
  /**
   * Item data (image or card information)
   */
  data: DeckEntryData | null;
  /**
   * Array of player IDs who have delivered this item
   */
  deliveredBy?: UID[];
};

/**
 * Represents a history entry for a request and deliveries
 */
export type HistoryEntry = {
  /**
   * ID of the player who made the request
   */
  requesterId: UID;
  /**
   * The clue provided
   */
  clue: string;
  /**
   * Quantity of items requested
   */
  quantity: number;
  /**
   * Array of item IDs that were delivered
   */
  deliverables: string[];
};

/**
 * Summary of remaining deliverables
 */
export type Summary = {
  /**
   * Total number of deliverables left
   */
  deliverablesLeft: number;
  /**
   * Number of deliverables left for side A
   */
  deliverablesLeftForA: number;
  /**
   * Number of deliverables left for side B
   */
  deliverablesLeftForB: number;
};

/**
 * State for the ASKING_FOR_SOMETHING phase
 * Players submit clues requesting items
 */
export type PhaseAskingForSomethingState = {
  /**
   * Type of deck being used (e.g., 'items', 'images')
   */
  deckType: string;
  /**
   * Type of clue input (e.g., 'drawing', 'text')
   */
  clueInputType: string;
  /**
   * Current game status
   */
  status: string;
  /**
   * The game deck with all items
   */
  deck: DeckEntry[];
  /**
   * History of all requests and deliveries
   */
  history: HistoryEntry[];
  /**
   * Summary of remaining deliverables
   */
  summary: Summary;
  /**
   * ID of the player making the request (set after first round)
   */
  requesterId?: UID;
  /**
   * Turn order of players (set after first round)
   */
  turnOrder?: UID[];
};

/**
 * State for the DELIVER_SOMETHING phase
 * Players deliver items based on the clue
 */
export type PhaseDeliveringSomethingState = {
  /**
   * Type of deck being used (e.g., 'items', 'images')
   */
  deckType: string;
  /**
   * Type of clue input (e.g., 'drawing', 'text')
   */
  clueInputType: string;
  /**
   * Current game status
   */
  status: string;
  /**
   * The game deck with all items
   */
  deck: DeckEntry[];
  /**
   * History of all requests and deliveries
   */
  history: HistoryEntry[];
  /**
   * Summary of remaining deliverables
   */
  summary: Summary;
  /**
   * Turn order of players
   */
  turnOrder: UID[];
  /**
   * ID of the player who made the request
   */
  requesterId: UID;
  /**
   * The clue provided by the requester
   */
  clue: string;
  /**
   * Number of items requested
   */
  clueQuantity: number;
};

/**
 * State for the VERIFICATION phase
 * Verifying the delivered item
 */
export type PhaseVerificationState = {
  /**
   * Type of deck being used (e.g., 'items', 'images')
   */
  deckType: string;
  /**
   * Type of clue input (e.g., 'drawing', 'text')
   */
  clueInputType: string;
  /**
   * The game deck with all items
   */
  deck: DeckEntry[];
  /**
   * History of all requests and deliveries
   */
  history: HistoryEntry[];
  /**
   * Summary of remaining deliverables
   */
  summary: Summary;
  /**
   * Turn order of players
   */
  turnOrder: UID[];
  /**
   * ID of the player who made the request
   */
  requesterId: UID;
  /**
   * The clue provided by the requester
   */
  clue: string;
  /**
   * Number of items requested
   */
  clueQuantity: number;
  /**
   * The next phase to transition to
   */
  nextPhase: string;
  /**
   * Current game status (CONTINUE, WIN, or LOSE)
   */
  status: string;
  /**
   * ID of the entry to animate (or null)
   */
  entryIdToAnimate: string | null;
  /**
   * The ID of the item being delivered
   */
  delivery: string;
};

/**
 * State for the GAME_OVER phase
 * Final game results
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: DateMilliseconds;
  /**
   * Array of winner player IDs
   */
  winners: UID[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * History of all requests and deliveries
   */
  history: HistoryEntry[];
  /**
   * Type of deck that was used (e.g., 'items', 'images')
   */
  deckType: string;
  /**
   * Type of clue input that was used (e.g., 'drawing', 'text')
   */
  clueInputType: string;
  /**
   * Final game status (WIN or LOSE)
   */
  status: string;
  /**
   * Final summary of deliverables
   */
  summary: Summary;
  /**
   * The final game deck
   */
  deck: DeckEntry[];
};
