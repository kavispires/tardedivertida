export type SubmitPagesPayload = {
  pageIds: CardId[];
};

export type SubmitDoorPayload = {
  doorId: CardId;
  ready?: boolean;
};
