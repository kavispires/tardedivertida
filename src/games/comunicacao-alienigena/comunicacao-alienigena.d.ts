type SubmitActionPayload2 = {};
type SubmitAlienPayload = {
  alienId: PlayerId;
};

type SubmitHumanInquiryPayload = {
  objectsIds: CardId[];
};

type SubmitAlienResponsePayload = {
  alienResponse: string;
};

type SubmitAlienRequestPayload = {
  alienRequest: string;
};

type SubmitOfferingPayload = {
  offeringId: CardId;
};

interface Item {
  id: string;
  type: string;
  offerings: PlayerId[];
  offered?: boolean;
}

interface Sign {
  signId: number;
  attribute: DualLanguageValue;
}

interface InquiryHistoryEntry {
  objectIds: CardId[];
  answer: string;
  playerId: PlayerId;
}

interface Offer {
  objectId: CardId;
  playerId: PlayerId;
}

interface RequestHistoryEntry {
  request: string;
  offers: Offer[];
}

interface OfferingsStatus {
  timeLeft: number;
  needed: number;
  total: number;
  found: number;
  totalCurses: number;
  curses: Record<string, PlayerId[]>;
}
