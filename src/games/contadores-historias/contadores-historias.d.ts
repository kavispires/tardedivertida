type TableEntry = {
  playerId: PlayerId;
  cardId: string;
  votes?: PlayerId[];
};

type SubmitStoryPayload = {
  story: string;
  cardId: string;
};

type PlayCardPayload = {
  cardId: string;
};

type SubmitVotePayload = {
  vote: string;
};
