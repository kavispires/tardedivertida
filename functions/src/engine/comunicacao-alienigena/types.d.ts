import { COMUNICACAO_ALIENIGENA_ACTIONS, ITEM_TYPES } from './constants';

export interface Item {
  id: string;
  type: keyof typeof ITEM_TYPES;
  offerings: PlayerId[];
  offered?: boolean;
}

export interface Offer {
  objectId: CardId;
  playerId: PlayerId;
}

export interface Sign {
  signId: number;
  attribute: DualLanguageValue;
}

export interface InquiryHistoryEntry {
  objectIds: CardId[];
  answer: string;
  playerId: PlayerId;
}
export interface RequestHistoryEntry {
  request: string;
  offers: Offer[];
}

export interface OfferingsStatus {
  timeLeft: number;
  needed: number;
  total: number;
  found: number;
  totalCurses: number;
  curses: Record<string, PlayerId[]>;
}

export interface ComunicacaoAlienigenaStore extends DefaultStore {
  [key: string]: any;
}

export interface ComunicacaoAlienigenaState extends DefaultState {
  [key: string]: any;
  status: OfferingsStatus;
  inquiryHistory: InquiryHistoryEntry[];
  requestHistory: RequestHistoryEntry[];
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
