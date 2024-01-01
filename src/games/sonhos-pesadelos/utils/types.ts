export type SubmitDreamPayload = {
  dream: string;
};

export type SubmitVotesPayload = {
  votes: StringDictionary;
};

export type Dream = {
  id: PlayerId;
  dream: string;
};

export type GalleryEntry = {
  playerId: PlayerId;
  dreamId: ImageCardId;
  dream: string;
  cards: {
    cardId: ImageCardId;
    votes: PlayerId[];
    isDream: boolean;
    isNightmare: boolean;
  }[];
};
