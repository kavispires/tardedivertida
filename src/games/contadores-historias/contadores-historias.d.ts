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

type COutcome = 'EVERYBODY_GOT' | 'NOBODY_GOT' | 'NORMAL';
