import type { PORTA_DOS_DESESPERADOS_ACHIEVEMENTS, PORTA_DOS_DESESPERADOS_ACTIONS, TRAPS } from './constants';

export type PortaDosDesesperadosOptions = {
  /**
   * Add bots to the game to go was players
   */
  withBots?: boolean;
  /**
   * Only use new traps
   */
  newTraps?: boolean;
};

export interface ResourceData {
  cards: ImageCardId[];
}

export interface PortaDosDesesperadosStore extends DefaultStore {
  relationships?: ImageCardRelationship;
  finalDoors?: ImageCardId[];
}

export interface PortaDosDesesperadosState extends DefaultState {
  [key: string]: any;
}

export interface PortaDosDesesperadosPlayer extends Player {
  [key: string]: any;
}

export type PortaDosDesesperadosPlayers = Record<PlayerId, PortaDosDesesperadosPlayer>;

export interface PortaDosDesesperadosInitialState extends InitialState {
  store: PortaDosDesesperadosStore;
  state: PortaDosDesesperadosState;
}

export interface PortaDosDesesperadosSubmitAction extends Payload {
  action: keyof typeof PORTA_DOS_DESESPERADOS_ACTIONS;
}

export type Trap = keyof typeof TRAPS;

export type PortaDosDesesperadosAchievement = keyof typeof PORTA_DOS_DESESPERADOS_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData & PortaDosDesesperadosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & PortaDosDesesperadosStore;
export type FirebasePlayersData = FirebaseFirestore.DocumentData & PortaDosDesesperadosPlayers;
