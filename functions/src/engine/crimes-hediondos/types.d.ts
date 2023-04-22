import { CRIMES_HEDIONDOS_ACTIONS } from './constants';

export type CrimesHediondosOptions = {
  withBots?: boolean;
};

export interface Crime {
  playerId: PlayerId;
  weaponId: string;
  evidenceId: string;
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
  allWeapons: CrimesHediondosCard[];
  allEvidence: CrimesHediondosCard[];
  allScenes: CrimeTile[];
}

export interface CrimesHediondosStore extends DefaultStore {
  scenes: CrimeTile[];
  [key: string]: any;
}

export interface CrimesHediondosState extends DefaultState {
  scenes?: {
    [key: string]: CrimeTile;
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
