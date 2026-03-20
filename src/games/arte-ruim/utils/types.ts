export type ArteRuimCard = {
  id: string;
  text: string;
  level: number;
  playerId?: UID;
};

export type ArteRuimDrawing = {
  id: string;
  drawing: string;
  playerId: UID;
  text: string;
  successRate?: number;
  level: number;
};

export type PlayersSay = {
  [key: string]: UID[];
};

export type ArteRuimWindow = {
  artistId: UID;
  correctAnswer: string;
  drawing: string;
  id: string;
  level: number;
  playersPoints?: Dictionary<number>;
  playersSay: PlayersSay;
  text: string;
};

export type SubmitDrawingPayload = {
  drawing: string;
  cardId: string;
};

export type SubmitVotingPayload = {
  votes: PlainObject;
  choseRandomly: boolean;
};
