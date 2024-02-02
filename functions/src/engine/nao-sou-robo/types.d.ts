import { TextCard } from '../../types/tdr';
import { NAO_SOU_ROBO_ACHIEVEMENTS, NAO_SOU_ROBO_ACTIONS } from './constants';

export interface NaoSouRoboOptions {
  [key: string]: boolean;
}

export interface ResourceData {
  images: CardId[];
  botCards: CardId[];
  emojis: number[];
  words: TextCard[];
  glyphs: number[];
  adjectives: TextCard[];
}

export interface Robot {
  points: number;
  goal: number;
  state: number;
  beat: number;
}

export interface Captcha {
  round: number;
  roundType: string;
  values: TextCard | number | number[];
}

export interface CaptchaCard {
  id: CardId;
  players: PlayerId[];
  bot: boolean;
  playerId?: PlayerId;
}

export interface GalleryEntry extends Captcha {
  options: CaptchaCard[];
  outcome: string;
  beaters: PlayerId[];
  score: number;
  suspicion: number;
}

export type NaoSouRoboAchievement = keyof typeof NAO_SOU_ROBO_ACHIEVEMENTS;

export interface NaoSouRoboStore extends DefaultStore {
  [key: string]: any;
}

export interface NaoSouRoboState extends DefaultState {
  [key: string]: any;
}

export interface NaoSouRoboInitialState extends InitialState {
  store: NaoSouRoboStore;
  state: NaoSouRoboState;
}

export interface NaoSouRoboSubmitAction extends Payload {
  action: keyof typeof NAO_SOU_ROBO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | NaoSouRoboState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | NaoSouRoboStore;
