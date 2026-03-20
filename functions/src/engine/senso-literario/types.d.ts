import type { SENSO_LITERARIO_ACHIEVEMENTS, SENSO_LITERARIO_ACTIONS } from './constants';

export type Pattern = {
  color: string;
  letter: string;
  genre: string;
};

export type GalleryEntry = {
  sequence: UID[];
  cards: {
    playersIsd: UID[];
    patternId: UID;
  }[];
};

export type SensoLiterarioAchievement = keyof typeof SENSO_LITERARIO_ACHIEVEMENTS;

export interface SensoLiterarioStore extends DefaultStore<unknown> {
  deck: UID[]; // The card id for this game is formatted as `${color}-${genre}-${letter}`
}

export interface SensoLiterarioState extends DefaultState {
  [key: string]: unknown;
}

export interface SensoLiterarioInitialState extends InitialState {
  store: SensoLiterarioStore;
  state: SensoLiterarioState;
}

export interface SensoLiterarioSubmitAction extends Payload {
  action: keyof typeof SENSO_LITERARIO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & SensoLiterarioState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & SensoLiterarioStore;
