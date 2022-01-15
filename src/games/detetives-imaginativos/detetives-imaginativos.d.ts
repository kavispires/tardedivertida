type DetetivesImaginativosCardEntry = {
  playerId: PlayerId;
  cards: string[];
};

type SubmitSecretCluePayload = {
  clue: string;
};

type SubmitPlayCardPayload = {
  cardId: string;
};

type SubmitVotePayload = {
  vote: PlayerId;
};
