type GWord = {
  id: string;
  text: string;
};

type GImageCard = {
  id: string;
  used: boolean;
};

type SubmitWordPayload = {
  wordId: string;
};

type SubmitCardsPayload = {
  cards: string[];
};

type PlayCardPayload = {
  cardId: string;
};

type LatestInfo = {
  cardId: string;
  completedPlayers: PlayerId[];
  matchCount: number;
  matchedPlayers: PlayerId[];
  cardsLeft: number;
  isPhaseOver?: boolean;
};

type GCardInHand = {
  used: boolean;
  score: number;
  matchedPlayers: PlayerId[];
  cardId: CardId;
};

type GImageCardMatch = {
  id: CardId;
  used: boolean;
  text: string;
  matchedPlayers: PlayerId[];
};
