// Types
import type { AlienAttribute, AlienItem } from '../../tool-kits/alien-attributes';
import type { COMUNICACAO_ALIENIGENA_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `comunicacao-alienigena` session.
 */
export type ComunicacaoAlienigenaOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * Enables alien bot
   */
  botAlien?: boolean;
  /**
   * Enables debug mode
   */
  debugMode?: boolean;
};

/**
 * Identifier of an item used in alien requests and offerings.
 */
export type ItemId = string;
/**
 * Identifier of an alien attribute or sign.
 */
export type SignId = string;
/**
 * Identifier of an alien-language sprite.
 */
export type SpriteId = string;

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * The item resources associated with this game step.
   */
  items: AlienItem[];
  /**
   * Alien attributes available for learning and constructing messages.
   */
  attributes: AlienAttribute[];
  /**
   * Identifiers of attributes known at the beginning of the game.
   */
  startingAttributesIds: SignId[];
}

/**
 * An item offered by a player in response to an alien request.
 */
export interface Offer {
  /**
   * Identifier of the item offered to the alien.
   */
  objectId: ItemId;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
}

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

/**
 * A recorded inquiry linking an item to the alien's sprite answer.
 */
export interface InquiryHistoryEntry {
  /**
   * Unique identifier for the inquiry
   */
  id: UID;
  /**
   * SpriteId for the answer
   */
  answer: SpriteId;
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
  /**
   * The suggestions the alien bot gave (only in bot games)
   */
  suggestions?: SignId[];
}
/**
 * An alien request with its submitted offers and optional intended item.
 */
export interface RequestHistoryEntry {
  /**
   * The alien-language request recorded for this round.
   */
  request: string;
  /**
   * Player offerings submitted in response to the request.
   */
  offers: Offer[];
  /**
   * Identifier of the item intended by the alien request.
   */
  intention?: ItemId;
}

/**
 * Progress, timing, and curse counts for the alien offering objective.
 */
export interface OfferingsStatus {
  /**
   * The remaining time for completing the offerings.
   */
  timeLeft: number;
  /**
   * The number of successful offerings required.
   */
  needed: number;
  /**
   * The total number of offerings tracked for the current status.
   */
  total: number;
  /**
   * The number of successful offerings completed.
   */
  found: number;
  /**
   * The total number of curses incurred.
   */
  totalCurses: number;
  /**
   * Players associated with each curse identifier.
   */
  curses: Record<string, UID[]>;
}

/**
 * Server-side data retained between phases of a `comunicacao-alienigena` session.
 */
export interface ComunicacaoAlienigenaStore extends DefaultStore<ComunicacaoAlienigenaOptions> {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `comunicacao-alienigena` session.
 */
export interface ComunicacaoAlienigenaState extends DefaultState {
  /**
   * Progress and timing data for the alien offering objective.
   */
  status?: OfferingsStatus;
  /**
   * Previously answered inquiries about the alien language.
   */
  inquiryHistory?: InquiryHistoryEntry[];
  /**
   * Previous alien requests and the offerings submitted for them.
   */
  requestHistory?: RequestHistoryEntry[];
  /**
   * A null turn-order placeholder for this simultaneous-action game.
   */
  turnOrder?: null; // TODO: remove
}

/**
 * The initial metadata, server-side store, and public state for a `comunicacao-alienigena` session.
 */
export interface ComunicacaoAlienigenaInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: ComunicacaoAlienigenaStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: ComunicacaoAlienigenaState;
}

/**
 * Player action payload accepted by the `comunicacao-alienigena` engine.
 */
export interface ComunicacaoAlienigenaSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof COMUNICACAO_ALIENIGENA_ACTIONS;
}

/**
 * Firestore document data used when reading the `comunicacao-alienigena` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | ComunicacaoAlienigenaState;
/**
 * Firestore document data used when reading the `comunicacao-alienigena` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ComunicacaoAlienigenaStore;
