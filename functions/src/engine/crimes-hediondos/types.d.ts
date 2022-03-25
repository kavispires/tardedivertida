import { CrimesHediondosCard } from '../../utils/tdi';
import { CrimesHediondosSceneTile } from '../../utils/tdr';
import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

interface Crime {
  playerId: PlayerId;
  weaponId: string;
  evidenceId: string;
  scenes: {
    [key: string]: number;
  };
  itemGroupIndex: number;
}

type Guess = {
  weaponId: string;
  evidenceId: string;
};

type GuessHistory = {
  [key: string]: GuessHistoryEntry[];
};

type GuessHistoryEntry = {
  weaponId: string;
  evidenceId: string;
  status: string;
  groupIndex: number;
};

type GroupedItems = {
  [key: string]: string[];
};

type WrongGroups = {
  [key: string]: number[];
};

interface ResourceData {
  allWeapons: CrimesHediondosCard[];
  allEvidence: CrimesHediondosCard[];
  allScenes: CrimesHediondosSceneTile[];
}

interface CrimesHediondosStore extends DefaultStore {
  scenes: CrimesHediondosSceneTile[];
  [key: string]: any;
}

interface CrimesHediondosState extends DefaultState {
  scenes: {
    [key: string]: CrimesHediondosSceneTile;
  };
  [key: string]: any;
}

interface CrimesHediondosInitialState extends InitialState {
  store: CrimesHediondosStore;
  state: CrimesHediondosState;
}

interface CrimesHediondosSubmitAction extends Payload {
  action: 'SUBMIT_CRIME' | 'SUBMIT_MARK' | 'SUBMIT_GUESSES';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | CrimesHediondosState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | CrimesHediondosStore;
