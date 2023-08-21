type SubmitActionPayload2 = {};

type SubmitAlienPayload = {
  alienId: PlayerId;
};

type SubmitSeedingPayload = {
  seeds: Record<CardId, CardId[]>;
};

type SubmitHumanInquiryPayload = {
  objectsIds: CardId[];
  intention: string;
};

type SubmitAlienResponsePayload = {
  alienResponse: string;
};

type SubmitAlienRequestPayload = {
  alienRequest: string;
  intention: string;
};

type SubmitOfferingPayload = {
  offeringId: CardId;
};

interface Item {
  id: string;
  type: string;
  offerings: PlayerId[];
  offered?: boolean;
  inquired?: number;
}

interface Sign {
  key: string;
  signId: string;
  attribute: DualLanguageValue;
}

interface InquiryHistoryEntry {
  objectIds: CardId[];
  answer: string;
  playerId: PlayerId;
  intention?: string;
}

interface Offer {
  objectId: CardId;
  playerId: PlayerId;
}

interface RequestHistoryEntry {
  request: string;
  offers: Offer[];
  intention?: CardId | null;
}

interface OfferingsStatus {
  timeLeft: number;
  needed: number;
  total: number;
  found: number;
  totalCurses: number;
  curses: Record<string, PlayerId[]>;
}
