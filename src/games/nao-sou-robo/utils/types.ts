export type SubmitRobotCardPayload = {
  cardId: CardId;
};

export type SubmitRobotGuessPayload = {
  guess: CardId[];
};

export type Robot = {
  points: number;
  goal: number;
  state: number;
  beat: number;
};

export type Captcha = {
  round: number;
  roundType: string;
  values: TextCard | number | number[];
};

export type CaptchaCard = {
  id: CardId;
  players: PlayerId[];
  bot: boolean;
  playerId?: PlayerId;
};

export type RobotGalleryEntry = {
  options: CaptchaCard[];
  outcome: string;
  beaters: PlayerId[];
  score: number;
  suspicion: number;
} & Captcha;
