// Types
import type { Achievement } from 'types/game';
// Components
import type { AlienAttribute, AlienItem } from 'components/toolKits/AlienAttributes';

/**
 * Payload for submitting selected alien player
 */
export type SubmitAlienPayload = {
  /**
   * The ID of the player chosen to be the alien
   */
  alienId: UID;
};

/**
 * Payload for submitting attribute seeding values
 */
export type SubmitSeedingPayload = {
  /**
   * Mapping of attribute IDs to their seeded values
   */
  seeds: Dictionary<number>;
};

/**
 * Payload for submitting a human player's inquiry
 */
export type SubmitHumanInquiryPayload = {
  /**
   * The IDs of objects the player is inquiring about
   */
  objectsIds: UID[];
  /**
   * The attribute the player intends to ask about
   */
  intention: string;
};

/**
 * Payload for submitting the alien's response
 */
export type SubmitAlienResponsePayload = {
  /**
   * The alien's response (attribute spriteId or drawing)
   */
  alienResponse: string;
};

/**
 * Payload for submitting the alien's request
 */
export type SubmitAlienRequestPayload = {
  /**
   * The alien's request (attribute signature)
   */
  alienRequest: string;
  /**
   * The item ID the alien intends to request
   */
  intention: string;
};

/**
 * Payload for submitting player offerings
 */
export type SubmitOfferingsPayload = {
  /**
   * The IDs of items being offered
   */
  offeringsIds: UID[];
};

/**
 * Identifier for an attribute sign/sprite
 */
export type SignId = string;

/**
 * Represents a seed assignment for unclear attribute values
 */
export type Seed = {
  /**
   * The attribute being seeded
   */
  attribute: AlienAttribute;
  /**
   * Items that have unclear values for this attribute
   */
  items: AlienItem[];
};

export interface InquiryHistoryEntry {
  /**
   * Alien drawing or spritId
   */
  answer: string;
  /**
   * The objects the player asked about
   */
  objectIds: UID[];
  /**
   * The player who asked the question
   */
  playerId: UID;
  /**
   * The attributeId the player intended to ask
   */
  intention: SignId;
  /**
   * The attribute Id the alien bot assumed
   */
  assumption?: SignId;
}

/**
 * Represents a player's offering in response to an alien request
 */
export interface Offer {
  /**
   * The ID of the offered object
   */
  objectId: UID;
  /**
   * The ID of the player making the offer
   */
  playerId: UID;
}

/**
 * Represents a historical record of an alien request and player responses
 */
export interface RequestHistoryEntry {
  /**
   * The alien's request (attribute signature)
   */
  request: string;
  /**
   * All offerings made by players in response
   */
  offers: Offer[];
  /**
   * The item ID the alien intended to request
   */
  intention?: UID | null;
}

/**
 * Tracks the current game progress and status
 */
export interface OfferingsStatus {
  /**
   * Remaining rounds before game ends
   */
  timeLeft: number;
  /**
   * Number of items needed to win
   */
  needed: number;
  /**
   * Total number of items that can be found
   */
  total: number;
  /**
   * Number of items found so far
   */
  found: number;
  /**
   * Total number of curses in the game
   */
  totalCurses: number;
  /**
   * Map of curse IDs to the players who selected them
   */
  curses: Record<string, UID[]>;
}

/**
 * Base state properties shared across most phases
 */
export type PhaseBasicState = {
  /**
   * List of all items/objects in the game
   */
  items: AlienItem[];
  /**
   * List of all alien attributes
   */
  attributes: AlienAttribute[];
  /**
   * History of all inquiry interactions
   */
  inquiryHistory: InquiryHistoryEntry[];
  /**
   * History of all request interactions
   */
  requestHistory: RequestHistoryEntry[];
  /**
   * Current game status tracking time, items found, and curses
   */
  status: OfferingsStatus;
  /**
   * The IDs of attributes shown at the start of the game
   */
  startingAttributesIds: string[];
  /**
   * Whether seeding should be performed by players
   */
  shouldPerformSeeding?: boolean;
  /**
   * The ID of the player acting as the alien
   */
  alienId?: UID | string;
  /**
   * Whether the alien is controlled by a bot
   */
  alienBot?: boolean;
  /**
   * Whether debug mode is enabled
   */
  debugMode?: boolean;
};

/**
 * State for the Setup phase
 * Initial game state with all core properties
 */
export type PhaseSetupState = PhaseBasicState;

/**
 * State for the Alien Selection phase
 * Players select who will be the alien (or bot is assigned)
 */
export type PhaseAlienSelectionState = PhaseBasicState;

/**
 * State for the Alien Seeding phase
 * Players seed unclear attribute values for the alien bot
 */
export type PhaseAlienSeedingState = PhaseBasicState & {
  /**
   * Seeding is required in this phase
   */
  shouldPerformSeeding: true;
  /**
   * The alien player ID (bot in this case)
   */
  alienId: string;
  /**
   * Bot is controlling the alien
   */
  alienBot: true;
};

/**
 * State for the Human Ask phase
 * Human players select objects to inquire about
 */
export type PhaseHumanAskState = PhaseBasicState & {
  /**
   * Order in which players take turns
   */
  turnOrder: TurnOrder;
  /**
   * The ID of the current human player asking
   */
  humanId: UID;
};

/**
 * State for the Alien Answer phase
 * Alien responds to the human's inquiry
 */
export type PhaseAlienAnswerState = PhaseBasicState & {
  /**
   * Order in which players take turns
   */
  turnOrder: TurnOrder;
  /**
   * The ID of the current human player asking
   */
  humanId: UID;
  /**
   * The object IDs the human is inquiring about
   */
  currentInquiry: UID[];
  /**
   * The attribute the human intends to ask about
   */
  currentIntention: string;
  /**
   * Suggested attributes for the alien's response
   */
  suggestions: AlienAttribute[];
  /**
   * The alien's response (attribute spriteId)
   */
  alienResponse?: string;
};

/**
 * State for the Alien Request phase
 * Alien makes a request for a specific item
 */
export type PhaseAlienRequestState = PhaseBasicState & {
  /**
   * Order in which players take turns
   */
  turnOrder: TurnOrder;
};

/**
 * State for the Offerings phase
 * Players offer items in response to the alien's request
 */
export type PhaseOfferingsState = PhaseBasicState & {
  /**
   * Order in which players take turns
   */
  turnOrder: TurnOrder;
};

/**
 * State for the Reveal phase
 * Reveals which offerings were correct, curses, or blank
 */
export type PhaseRevealState = PhaseBasicState & {
  /**
   * Order in which players take turns
   */
  turnOrder: TurnOrder;
  /**
   * Whether any curse was selected in this round
   */
  wasCurseSelected: boolean;
  /**
   * Map of curse IDs to the players who selected them in this round
   */
  curses: Record<UID, UID[]>;
};

/**
 * State for the Game Over phase
 * Final game state with winners and achievements
 */
export type PhaseGameOverState = {
  /**
   * List of all items/objects in the game
   */
  items: AlienItem[];
  /**
   * List of all alien attributes
   */
  attributes: AlienAttribute[];
  /**
   * History of all inquiry interactions
   */
  inquiryHistory: InquiryHistoryEntry[];
  /**
   * History of all request interactions
   */
  requestHistory: RequestHistoryEntry[];
  /**
   * Final game status
   */
  status: OfferingsStatus;
  /**
   * The IDs of attributes shown at the start of the game
   */
  startingAttributesIds: string[];
  /**
   * The ID of the player who was the alien
   */
  alienId: UID | string;
  /**
   * Whether the alien was controlled by a bot
   */
  alienBot: boolean;
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * List of winning player IDs
   */
  winners: UID[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Whether debug mode is enabled
   */
  debugMode?: boolean;
};
