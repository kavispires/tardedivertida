export type ArteRuimCard = {
  id: string;
  text: string;
  level: number;
  playerId?: PlayerId;
};

export type ArteRuimDrawing = {
  id: string;
  drawing: string;
  playerId: PlayerId;
  text: string;
  successRate?: number;
  level: number;
};

export type PlayersSay = {
  [key: string]: PlayerId[];
};

export type ArteRuimWindow = {
  artistId: PlayerId;
  correctAnswer: string;
  drawing: string;
  id: string;
  level: number;
  playersPoints?: NumberDictionary;
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
