// Components
import type { AlienAttribute, AlienItem } from 'components/toolKits/AlienAttributes';

export type SubmitAlienPayload = {
  alienId: UID;
};

export type SubmitSeedingPayload = {
  seeds: Dictionary<number>;
};

export type SubmitHumanInquiryPayload = {
  objectsIds: UID[];
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
  offeringsIds: UID[];
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

export interface Offer {
  objectId: UID;
  playerId: UID;
}

export interface RequestHistoryEntry {
  request: string;
  offers: Offer[];
  intention?: UID | null;
}

export interface OfferingsStatus {
  timeLeft: number;
  needed: number;
  total: number;
  found: number;
  totalCurses: number;
  curses: Record<string, UID[]>;
}

export type PhaseBasicState = {
  items: AlienItem[];
  attributes: AlienAttribute[];
  inquiryHistory: InquiryHistoryEntry[];
  requestHistory: RequestHistoryEntry[];
  status: OfferingsStatus;
  startingAttributesIds: string[];
  shouldPerformSeeding?: boolean;
  alienId?: UID | string;
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
  humanId: UID;
};

export type PhaseAlienAnswerState = PhaseBasicState & {
  turnOrder: TurnOrder;
  humanId: UID;
  currentInquiry: UID[];
  currentIntention: string;
  suggestions: AlienAttribute[];
  alienResponse?: string;
};

export type PhaseOfferings = PhaseBasicState & {
  turnOrder: TurnOrder;
  humanId: UID;
  currentInquiry: UID[];
  currentIntention: string;
};

export type PhaseRevealState = PhaseBasicState & {
  turnOrder: TurnOrder;
  humanId: UID;
  wasCurseSelected: boolean;
  curses: Record<UID, UID[]>;
};
