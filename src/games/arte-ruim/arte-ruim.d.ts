type ArteRuimCard = {
  id: string;
  text: string;
  level: number;
  playerId?: PlayerId;
};

type ArteRuimDrawing = {
  id: string;
  drawing: string;
  playerId: PlayerId;
  text: string;
  successRate?: number;
  level: number;
};

type PlayersSay = {
  [key: string]: PlayerId[];
};

type ArteRuimWindow = {
  artistId: PlayerId;
  correctAnswer: string;
  drawing: string;
  id: string;
  level: number;
  playersPoints?: NumberDictionary;
  playersSay: PlayersSay;
  text: string;
};

type SubmitDrawingPayload = {
  drawing: string;
  cardId: string;
};

type SubmitVotingPayload = {
  votes: PlainObject;
  choseRandomly: boolean;
};
