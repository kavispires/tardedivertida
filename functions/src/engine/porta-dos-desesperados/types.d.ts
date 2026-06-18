import type { PORTA_DOS_DESESPERADOS_ACTIONS, TRAPS } from './constants';

export type PortaDosDesesperadosOptions = {
  /**
   * Add bots to the game to go was players
   */
  withBots?: boolean;
};

export type Trap = keyof typeof TRAPS;
export interface ResourceData {
  cards: UID[];
}

export type TrapEntry = {
  id: string;
  setup: 'backend' | 'frontend' | 'fullstack';
  level: number;
  target: 'clue' | 'guess' | 'all';
  note: string;
  icon:
    | 'dreamCatcher'
    | 'magicCandles'
    | 'magicDivination'
    | 'magicHamsa'
    | 'magicRunes'
    | 'magicTarotCards'
    | 'magicVoodooDoll';
  title: DualLanguageValue;
  description: DualLanguageValue;
};

export interface PortaDosDesesperadosStore extends DefaultStore {
  relationships?: ImageCardRelationship;
  finalDoors?: UID[];
}

export interface PortaDosDesesperadosState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface PortaDosDesesperadosPlayer extends Player {
  [key: string]: AnyOrUnknownPlaceholder;
}

export type PortaDosDesesperadosPlayers = Record<UID, PortaDosDesesperadosPlayer>;

export interface PortaDosDesesperadosInitialState extends InitialState {
  store: PortaDosDesesperadosStore;
  state: PortaDosDesesperadosState;
}

export interface PortaDosDesesperadosSubmitAction extends Payload {
  action: keyof typeof PORTA_DOS_DESESPERADOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & PortaDosDesesperadosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & PortaDosDesesperadosStore;
export type FirebasePlayersData = FirebaseFirestore.DocumentData & PortaDosDesesperadosPlayers;
