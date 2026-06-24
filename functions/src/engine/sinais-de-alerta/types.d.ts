// Types
import type { TextCardData } from '../../types/tdr';
import type { SINAIS_DE_ALERTA_ACTIONS } from './constants';

export type SinaisDeAlertaOptions = {
  /**
   * Longer timer
   */
  longerTimer: boolean;
};

export type ResourceData = {
  allDescriptors: TextCardData[];
  allSubjects: TextCardData[];
};

export type DrawingEntryData = {
  playerId: UID;
  subjectId: UID;
  descriptorId: UID;
  drawing: string;
};

export type PlayersSay = {
  playersIds: UID[];
  subjectId: UID;
  descriptorId: UID;
  score: number;
};

export type GalleryEntry = {
  id: string;
  title: string;
  subjectId: UID;
  descriptorId: UID;
  artistId: UID;
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
  subjectsDeck: TextCardData[];
  descriptorsDeck: TextCardData[];
}

export interface SinaisDeAlertaState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface SinaisDeAlertaInitialState extends InitialState {
  store: SinaisDeAlertaStore;
  state: SinaisDeAlertaState;
}

export interface SinaisDeAlertaSubmitAction extends Payload {
  action: keyof typeof SINAIS_DE_ALERTA_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & SinaisDeAlertaState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & SinaisDeAlertaStore;
