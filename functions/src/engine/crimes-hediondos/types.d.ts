import { CrimeSceneTile, CrimesHediondosCard } from '../../types/tdr';
import { CRIMES_HEDIONDOS_ACHIEVEMENTS, CRIMES_HEDIONDOS_ACTIONS } from './constants';

export type CrimesHediondosOptions = {
  /**
   * Uses the original images instead of the TD items sprites
   */
  originalImages?: boolean;
  /**
   * Adds bots with 2 crimes
   */
  withBots?: boolean;
};

export type CrimesHediondosAchievement = keyof typeof CRIMES_HEDIONDOS_ACHIEVEMENTS;

export interface Crime {
  playerId: PlayerId;
  weaponId: string;
  // weaponItemId: string | null;
  evidenceId: string;
  // evidenceItemId: string | null;
  scenes: {
    [key: string]: number;
  };
  itemGroupIndex: number;
}

export type Guess = {
  weaponId: string;
  evidenceId: string;
};

export type Guesses = Record<PlayerId, Guess>;

export type GuessHistory = {
  [key: string]: GuessHistoryEntry[];
};

export type GuessHistoryEntry = {
  weaponId: string;
  evidenceId: string;
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
  allScenes: CrimeSceneTile[];
}

export interface CrimesHediondosStore extends DefaultStore {
  scenes: CrimeSceneTile[];
  [key: string]: any;
}

export interface CrimesHediondosState extends DefaultState {
  scenes?: {
    [key: string]: CrimeSceneTile;
  };
  [key: string]: any;
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
