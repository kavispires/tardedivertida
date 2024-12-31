export type SubmitRequestPayload = {
  clue: string;
  clueQuantity: number;
};

export type SubmitDeliveryPayload = {
  delivery: string;
};

export type DeckEntry = {
  id: string;
  affiliation: [string, string];
  status: string;
  data: any;
  deliveredBy?: PlayerId[];
};

export type HistoryEntry = {
  requesterId: PlayerId;
  clue: string;
  deliverables: string[];
};

export type Summary = {
  deliverablesLeft: number;
  deliverablesLeftForA: number;
  deliverablesLeftForB: number;
};
