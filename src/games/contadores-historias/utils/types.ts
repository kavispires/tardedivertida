export type TableEntry = {
  playerId: PlayerId;
  cardId: string;
  votes?: PlayerId[];
};

export type SubmitStoryPayload = {
  story: string;
  cardId: string;
};

export type PlayCardPayload = {
  cardId: string;
};

export type SubmitVotePayload = {
  vote: string;
};

export type Outcome = 'EVERYBODY_GOT' | 'NOBODY_GOT' | 'NORMAL';
