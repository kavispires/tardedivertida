import {
  DefaultState,
  DefaultStore,
  DualLanguageValue,
  InitialState,
  Payload,
  PlayerId,
} from '../../utils/types';

type CrimesHediondosCard = {
  id: string;
  type: string;
  name: DualLanguageValue;
};

type SceneTile = {
  id: string;
  type: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  values: DualLanguageValue[];
  specific?: string | null;
};

interface Crime {
  playerId: PlayerId;
  weaponId: string;
  evidenceId: string;
  scenes: {
    [key: string]: number;
  };
}

type GuessHistory = {
  [key: string]: { weaponId: string; evidenceId: string; correct?: boolean }[];
};

interface ResourceData {
  allWeapons: CrimesHediondosCard[];
  allEvidence: CrimesHediondosCard[];
  allScenes: SceneTile[];
}

interface CrimesHediondosStore extends DefaultStore {
  scenes: SceneTile[];
  [key: string]: any;
}

interface CrimesHediondosState extends DefaultState {
  scenes: {
    [key: string]: SceneTile;
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

type Count = {
  bothCorrect: number;
  correctItems: number;
  win: boolean;
};

type Counts = {
  [key: string]: Count;
};