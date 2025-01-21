// Components
import type { AlienAttribute, AlienItem } from 'components/toolKits/AlienAttributes';

export type SubmitAlienPayload = {
  alienId: PlayerId;
};

export type SubmitSeedingPayload = {
  seeds: NumberDictionary;
};

export type SubmitHumanInquiryPayload = {
  objectsIds: CardId[];
  intention: string;
};

export type SubmitAlienResponsePayload = {
  alienResponse: string;
};

export type SubmitAlienRequestPayload = {
  alienRequest: string;
  intention: string;
};

export type SubmitOfferingsPayload = {
  offeringsIds: CardId[];
};

export type SignId = string;

export type Seed = {
  attribute: AlienAttribute;
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

export interface Offer {
  objectId: CardId;
  playerId: PlayerId;
}

export interface RequestHistoryEntry {
  request: string;
  offers: Offer[];
  intention?: CardId | null;
}

export interface OfferingsStatus {
  timeLeft: number;
  needed: number;
  total: number;
  found: number;
  totalCurses: number;
  curses: Record<string, PlayerId[]>;
}

export type PhaseBasicState = {
  items: AlienItem[];
  attributes: AlienAttribute[];
  inquiryHistory: InquiryHistoryEntry[];
  requestHistory: RequestHistoryEntry[];
  status: OfferingsStatus;
  startingAttributesIds: string[];
  shouldPerformSeeding?: boolean;
  alienId?: PlayerId | string;
  alienBot?: boolean;
  debugMode?: boolean;
};

export type PhaseAlienSeedingState = PhaseBasicState & {
  shouldPerformSeeding: true;
  alienId: string;
  alienBot: true;
};

export type PhaseHumanAskState = PhaseBasicState & {
  turnOrder: TurnOrder;
  humanId: PlayerId;
};

export type PhaseAlienAnswerState = PhaseBasicState & {
  turnOrder: TurnOrder;
  humanId: PlayerId;
  currentInquiry: CardId[];
  currentIntention: string;
  suggestions: AlienAttribute[];
  alienResponse?: string;
};

export type PhaseOfferings = PhaseBasicState & {
  turnOrder: TurnOrder;
  humanId: PlayerId;
  currentInquiry: CardId[];
  currentIntention: string;
};

export type PhaseRevealState = PhaseBasicState & {
  turnOrder: TurnOrder;
  humanId: PlayerId;
  wasCurseSelected: boolean;
  curses: Record<CardId, PlayerId[]>;
};
