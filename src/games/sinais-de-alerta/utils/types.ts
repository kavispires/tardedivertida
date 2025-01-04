export type SubmitDrawingPayload = {
  drawing: string;
};

export type SubmitEvaluationPayload = {
  guesses: ArrayDictionary<CardId>;
  choseRandomly: boolean;
};

export type DrawingEntry = {
  playerId: PlayerId;
  subjectId: CardId;
  descriptorId: CardId;
  drawing: string;
};

export type PlayersSay = {
  playersIds: PlayerId[];
  subjectId: CardId;
  descriptorId: CardId;
  score: number;
};

export type GalleryEntry = {
  id: string;
  title: string;
  subjectId: CardId;
  descriptorId: CardId;
  artistId: PlayerId;
  artistScore: number;
  drawing: string;
  playersSay: PlayersSay[];
  accuracy: number;
  correctness: number;
};

export type FinalGalleryEntry = {
  id: string;
  title: string;
  playerId: string;
  drawing: string;
  accuracy: number;
};
