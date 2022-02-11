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
  fallenPlayers: PlayerId[];
  matchCount: number;
  matchedPlayers: PlayerId[];
  cardsLeft: number;
};
