import type { AlienAttribute, AlienItem } from '../../utils/tool-kits/alien-attributes';
import type { COMUNICACAO_ALIENIGENA_ACHIEVEMENTS, COMUNICACAO_ALIENIGENA_ACTIONS } from './constants';

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

export type ItemId = string;
export type SignId = string;
export type SpriteId = string;

export interface ResourceData {
  items: AlienItem[];
  attributes: AlienAttribute[];
  startingAttributesIds: SignId[];
}

export interface Offer {
  objectId: ItemId;
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
export interface RequestHistoryEntry {
  request: string;
  offers: Offer[];
  intention?: ItemId;
}

export interface OfferingsStatus {
  timeLeft: number;
  needed: number;
  total: number;
  found: number;
  totalCurses: number;
  curses: Record<string, UID[]>;
}

export type ComunicacaoAlienigenaAchievement = keyof typeof COMUNICACAO_ALIENIGENA_ACHIEVEMENTS;

export interface ComunicacaoAlienigenaStore extends DefaultStore<ComunicacaoAlienigenaOptions> {
  [key: string]: any;
}

export interface ComunicacaoAlienigenaState extends DefaultState {
  status?: OfferingsStatus;
  inquiryHistory?: InquiryHistoryEntry[];
  requestHistory?: RequestHistoryEntry[];
  turnOrder?: null; // TODO: remove
}

export interface ComunicacaoAlienigenaInitialState extends InitialState {
  store: ComunicacaoAlienigenaStore;
  state: ComunicacaoAlienigenaState;
}

export interface ComunicacaoAlienigenaSubmitAction extends Payload {
  action: keyof typeof COMUNICACAO_ALIENIGENA_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ComunicacaoAlienigenaState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ComunicacaoAlienigenaStore;
