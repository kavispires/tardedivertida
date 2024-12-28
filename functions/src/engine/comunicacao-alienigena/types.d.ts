import type { AlienItem } from '../../types/tdr';
import type {
  COMUNICACAO_ALIENIGENA_ACHIEVEMENTS,
  COMUNICACAO_ALIENIGENA_ACTIONS,
  ITEM_TYPES,
} from './constants';

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
   * Enables easy mode (3 attributes in the beginning instead of 1)
   */
  easyMode?: boolean;
  /**
   * Enables debug mode
   */
  debugMode?: boolean;
};

export type ItemId = string;
export type SignId = string;
export type SignKey = string;

export interface ResourceData {
  signs: Sign[];
  items: Item[];
  botAlienItemKnowledge: Record<string, AlienItem>;
  startingAttributes: Sign[];
}

export interface Item {
  id: ItemId;
  type: keyof typeof ITEM_TYPES;
  offerings: PlayerId[];
  offered?: boolean;
  inquired?: number;
  name?: DualLanguageValue;
}

export interface Offer {
  objectId: ItemId;
  playerId: PlayerId;
}

export interface Sign {
  /**
   * Image id
   */
  signId: SignId;
  /**
   * Attribute key
   */
  key: SignKey;
  /**
   * Attribute name
   */
  attribute: DualLanguageValue;
  /**
   * Attribute description
   */
  description?: DualLanguageValue;
}

export interface InquiryHistoryEntry {
  objectIds: CardId[];
  answer: string;
  playerId: PlayerId;
  intention?: SignKey;
  assumption?: SignKey;
  confidence?: number;
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
  botAlienItemKnowledge: Record<ItemId, AlienItem>;
  botAlienSignKnowledge: Record<SignKey, ItemId[]>;
}

export interface ComunicacaoAlienigenaState extends DefaultState {
  [key: string]: any;
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
