export type CardEntry = {
  playerId: PlayerId;
  cards: string[];
};

export type SubmitSecretCluePayload = {
  clue: string;
};

export type SubmitPlayCardPayload = {
  cardId: string;
};

export type SubmitVotePayload = {
  vote: PlayerId;
};
