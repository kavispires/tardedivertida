import type { ESCAPE_ROOM_ACHIEVEMENTS, ESCAPE_ROOM_ACTIONS, OUTCOME } from './constants';

export type EscapeRoomOptions = {
  /**
   * Adds a row and column to the grid
   */
  duration: 'default' | 'short' | 'long';
  /**
   * Allow nsfw content
   */
  nsfw: boolean;
};

export type ResourceData = {
  [key: string]: unknown;
};

export type Outcome = keyof typeof OUTCOME;

export type EscapeRoomAchievement = keyof typeof ESCAPE_ROOM_ACHIEVEMENTS;

export interface EscapeRoomStore extends DefaultStore<EscapeRoomOptions> {
  [key: string]: unknown;
}

export interface EscapeRoomState extends DefaultState {
  [key: string]: unknown;
}

export interface EscapeRoomInitialState extends InitialState {
  store: EscapeRoomStore;
  state: EscapeRoomState;
}

export interface EscapeRoomSubmitAction extends Payload {
  action: keyof typeof ESCAPE_ROOM_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & EscapeRoomState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & EscapeRoomStore;
