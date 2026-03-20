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
  completedPlayers: UID[];
  matchCount: number;
  matchedPlayers: UID[];
  cardsLeft: number;
  isPhaseOver?: boolean;
};

export type CardInHand = {
  used: boolean;
  score: number;
  matchedPlayers: UID[];
  cardId: UID;
};

export type ImageCardMatch = {
  id: UID;
  used: boolean;
  text: string;
  matchedPlayers: UID[];
};
