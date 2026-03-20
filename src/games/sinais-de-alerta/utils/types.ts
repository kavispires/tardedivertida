export type SubmitDrawingPayload = {
  drawing: string;
};

export type SubmitEvaluationPayload = {
  guesses: Dictionary<UID[]>;
  choseRandomly: boolean;
};

export type DrawingEntry = {
  playerId: UID;
  subjectId: UID;
  descriptorId: UID;
  drawing: string;
};

export type PlayersSay = {
  playersIds: UID[];
  subjectId: UID;
  descriptorId: UID;
  score: number;
};

export type GalleryEntry = {
  id: string;
  title: string;
  subjectId: UID;
  descriptorId: UID;
  artistId: UID;
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
