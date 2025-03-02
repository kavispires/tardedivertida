import type { DilemmaCard } from '../../types/tdr';
import type { ESCAPE_ROOM_ACHIEVEMENTS, ESCAPE_ROOM_ACTIONS } from './constants';

export type EscapeRoomOptions = {
  /**
   * Indicate if the tutorial must played first
   */
  playTutorial: boolean;
};

export type ResourceData = {
  tutorial: unknown;
  episode: unknown;
};

export type EscapeRoomAchievement = keyof typeof ESCAPE_ROOM_ACHIEVEMENTS;

export interface EscapeRoomStore extends DefaultStore {
  deck: DilemmaCard[];
}

export interface EscapeRoomState extends DefaultState {
  [key: string]: any;
}

export interface EscapeRoomInitialState extends InitialState {
  store: EscapeRoomStore;
  state: EscapeRoomState;
}

export interface EscapeRoomSubmitAction extends Payload {
  action: keyof typeof ESCAPE_ROOM_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | EscapeRoomState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | EscapeRoomStore;
