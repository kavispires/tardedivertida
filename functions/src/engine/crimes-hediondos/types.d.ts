import type { CrimeSceneTile, CrimesHediondosCard } from '../../types/tdr';
import type { CRIMES_HEDIONDOS_ACHIEVEMENTS, CRIMES_HEDIONDOS_ACTIONS } from './constants';

export type CrimesHediondosOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * Adds bots with 2 crimes
   */
  withBots?: boolean;
  /**
   * Adds locations to game
   */
  withLocations?: boolean;
  /**
   * Adds victims to game
   */
  withVictims?: boolean;
};

export type CrimesHediondosAchievement = keyof typeof CRIMES_HEDIONDOS_ACHIEVEMENTS;

export interface Crime {
  playerId: PlayerId;
  weaponId: string;
  evidenceId: string;
  locationId?: string;
  victimId?: string;
  scenes: {
    [key: string]: number;
  };
  itemGroupIndex: number;
}

export type Guess = {
  weaponId: string;
  evidenceId: string;
  locationId?: string;
  victimId?: string;
};

export type Guesses = Record<PlayerId, Guess>;

export type GuessHistory = {
  [key: string]: GuessHistoryEntry[];
};

export type GuessHistoryEntry = {
  weaponId: string;
  evidenceId: string;
  locationId?: string;
  victimId?: string;
  status: string;
  groupIndex: number;
};

export type GroupedItems = {
  [key: string]: string[];
};

export type WrongGroups = {
  [key: string]: number[];
};

export interface ResourceData {
  weapons: CrimesHediondosCard[];
  evidence: CrimesHediondosCard[];
  locations?: CrimesHediondosCard[];
  victims?: CrimesHediondosCard[];
  allScenes: CrimeSceneTile[];
}

export interface CrimesHediondosStore extends DefaultStore {
  scenes: CrimeSceneTile[];
}

export interface CrimesHediondosState extends DefaultState {
  scenes?: {
    [key: string]: CrimeSceneTile;
  };
}

export interface CrimesHediondosInitialState extends InitialState {
  store: CrimesHediondosStore;
  state: CrimesHediondosState;
}

export interface CrimesHediondosSubmitAction extends Payload {
  action: keyof typeof CRIMES_HEDIONDOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | CrimesHediondosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | CrimesHediondosStore;
