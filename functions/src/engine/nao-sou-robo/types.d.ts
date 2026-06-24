// Types
import type { TextCardData } from '../../types/tdr';
import type { NAO_SOU_ROBO_ACTIONS } from './constants';

export interface NaoSouRoboOptions {
  [key: string]: boolean;
}

export interface ResourceData {
  images: UID[];
  botCards: UID[];
  emojis: number[];
  words: TextCardData[];
  colors: TextCardData[];
  emotions: TextCardData[];
  glyphs: number[];
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
  values: TextCardData | number | number[];
}

export interface CaptchaCard {
  id: UID;
  players: UID[];
  bot: boolean;
  playerId?: UID;
}

export interface GalleryEntry extends Captcha {
  options: CaptchaCard[];
  outcome: string;
  beaters: UID[];
  score: number;
  suspicion: number;
}

export interface NaoSouRoboStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface NaoSouRoboState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
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
