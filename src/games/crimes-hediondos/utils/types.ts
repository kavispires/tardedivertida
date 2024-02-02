import type { CrimesHediondosCard, CrimeSceneTile } from 'types/tdr';

export type GroupedItems = {
  [key: string]: string[];
};

export type ItemsDict = {
  [key: string]: CrimesHediondosCard;
};

export type ScenesDict = {
  [key: string]: CrimeSceneTile;
};

export type SceneTilePayload = {
  tileId: string;
  value: number;
};

export type Crime = {
  playerId: PlayerId;
  weaponId: string;
  evidenceId: string;
  scenes: {
    [key: string]: number;
  };
};

export type SubmitCrimePayload = {
  weaponId?: string;
  evidenceId?: string;
  causeOfDeath?: number;
  reasonForEvidence?: number;
  locationTile?: string;
  locationIndex?: number;
};

export type SubmitMarkPayload = {
  sceneIndex: number;
};

export type SubmitGuessesPayload = {
  guesses: PlainObject;
};

export type Guess = {
  weaponId: string;
  evidenceId: string;
};

export type GuessHistoryEntry = {
  weaponId: string;
  evidenceId: string;
  status: string;
  groupIndex: number;
};

export type History = {
  [key: string]: GuessHistoryEntry[];
};

export type Results = {
  [key: string]: StringDictionary;
};
