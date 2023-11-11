type SubmitRobotCardPayload = {
  cardId: CardId;
};

type SubmitRobotGuessPayload = {
  guess: CardId[];
};

interface Robot {
  points: number;
  goal: number;
  state: number;
  beat: number;
}

interface Captcha {
  round: number;
  roundType: string;
  values: TextCard | number | number[];
}

interface CaptchaCard {
  id: CardId;
  players: PlayerId[];
  bot: boolean;
  playerId?: PlayerId;
}

interface RobotGalleryEntry extends Captcha {
  options: CaptchaCard[];
  outcome: string;
  beaters: PlayerId[];
  score: number;
  suspicion: number;
}
