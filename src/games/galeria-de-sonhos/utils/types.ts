export type ImageCardObj = {
  id: string;
  used: boolean;
};

export type SubmitWordPayload = {
  wordId: string;
};

export type SubmitCardsPayload = {
  cardsIds: string[];
};

export type PlayCardPayload = {
  cardId: string;
};

export type LatestInfo = {
  cardId: string;
  completedPlayers: PlayerId[];
  matchCount: number;
  matchedPlayers: PlayerId[];
  cardsLeft: number;
  isPhaseOver?: boolean;
};

export type CardInHand = {
  used: boolean;
  score: number;
  matchedPlayers: PlayerId[];
  cardId: CardId;
};

export type ImageCardMatch = {
  id: CardId;
  used: boolean;
  text: string;
  matchedPlayers: PlayerId[];
};
