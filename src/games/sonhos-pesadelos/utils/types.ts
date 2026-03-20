export type SubmitDreamPayload = {
  dream: string;
};

export type SubmitVotesPayload = {
  votes: Dictionary<string>;
};

export type Dream = {
  id: UID;
  dream: string;
};

export type GalleryEntry = {
  playerId: UID;
  dreamId: UID;
  dream: string;
  cards: {
    cardId: UID;
    votes: UID[];
    isDream: boolean;
    isNightmare: boolean;
  }[];
};
