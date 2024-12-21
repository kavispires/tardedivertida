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

export type SubmitOfferingPayload = {
  offeringId: CardId;
};

export type SignKey = string;

export interface Item {
  id: string;
  type: string;
  offerings: PlayerId[];
  offered?: boolean;
  inquired?: number;
  name?: DualLanguageValue;
}

export interface Sign {
  key: SignKey;
  signId: string;
  attribute: DualLanguageValue;
  description?: DualLanguageValue;
}

export type Seed = {
  attribute: Sign;
  items: Item[];
};

export interface InquiryHistoryEntry {
  objectIds: CardId[];
  answer: string;
  playerId: PlayerId;
  intention?: SignKey;
  assumption?: SignKey;
  confidence?: number;
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
