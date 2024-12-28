import type { TextCard } from '../../types/tdr';
import type { SINAIS_DE_ALERTA_ACHIEVEMENTS, SINAIS_DE_ALERTA_ACTIONS } from './constants';

export type SinaisDeAlertaOptions = {
  /**
   * Longer timer
   */
  longerTimer: boolean;
};

export type ResourceData = {
  allDescriptors: TextCard[];
  allSubjects: TextCard[];
};

export type DrawingEntry = {
  playerId: PlayerId;
  subjectId: CardId;
  descriptorId: CardId;
  drawing: string;
};

export type PlayersSay = {
  playersIds: PlayerId[];
  subjectId: CardId;
  descriptorId: CardId;
  score: number;
};

export type GalleryEntry = {
  id: string;
  title: string;
  subjectId: CardId;
  descriptorId: CardId;
  artistId: PlayerId;
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

export interface SinaisDeAlertaStore extends DefaultStore {
  subjectsDeck: TextCard[];
  descriptorsDeck: TextCard[];
  [key: string]: any;
}

export interface SinaisDeAlertaState extends DefaultState {
  [key: string]: any;
}

export interface SinaisDeAlertaInitialState extends InitialState {
  store: SinaisDeAlertaStore;
  state: SinaisDeAlertaState;
}

export type SinaisDeAlertaAchievement = keyof typeof SINAIS_DE_ALERTA_ACHIEVEMENTS;

export interface SinaisDeAlertaSubmitAction extends Payload {
  action: keyof typeof SINAIS_DE_ALERTA_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & SinaisDeAlertaState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & SinaisDeAlertaStore;
