// Types
import type { TextCard } from 'types/tdr';

export type SubmitRobotCardPayload = {
  cardId: UID;
};

export type SubmitRobotGuessPayload = {
  guess: UID[];
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
  values: TextCard | number | number[] | string[];
};

export type CaptchaCard = {
  id: UID;
  players: UID[];
  bot: boolean;
  playerId?: UID;
};

export type RobotGalleryEntry = {
  options: CaptchaCard[];
  outcome: string;
  beaters: UID[];
  score: number;
  suspicion: number;
} & Captcha;
