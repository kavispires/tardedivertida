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
  playerId: PlayerId;
}

export interface InquiryHistoryEntry {
  /**
   * Alien drawing or spritId
   */
  answer: string;
  /**
   * The objects the player asked about
   */
  objectIds: CardId[];
  /**
   * The player who asked the question
   */
  playerId: PlayerId;
  /**
   * The attributeId the player intended to ask
   */
  intention: SignId;
  /**
   * The attribute Id the alien bot assumed
   */
  assumption?: SignId;
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
  curses: Record<string, PlayerId[]>;
}

export type ComunicacaoAlienigenaAchievement = keyof typeof COMUNICACAO_ALIENIGENA_ACHIEVEMENTS;

export interface ComunicacaoAlienigenaStore extends DefaultStore<ComunicacaoAlienigenaOptions> {
  [key: string]: any;
}

export interface ComunicacaoAlienigenaState extends DefaultState {
  status?: OfferingsStatus;
  inquiryHistory?: InquiryHistoryEntry[];
  requestHistory?: RequestHistoryEntry[];
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
