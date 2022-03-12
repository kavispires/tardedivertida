type HCard = {
  id: string;
  type: string;
  name: DualLanguageValue;
};

type GroupedItems = {
  [key: string]: string[];
};

type ItemsDict = {
  [key: string]: HCard;
};

type SceneTile = {
  id: string;
  type: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  values: DualLanguageValue[];
  specific?: string | null;
};

type ScenesDict = {
  [key: string]: SceneTile;
};

type SceneTilePayload = {
  tileId: string;
  value: number;
};

type Crime = {
  playerId: PlayerId;
  weaponId: string;
  evidenceId: string;
  scenes: {
    [key: string]: number;
  };
};

type SubmitCrimePayload = {
  weaponId?: string;
  evidenceId?: string;
  causeOfDeath?: number;
  reasonForEvidence?: number;
  locationTile?: string;
  locationIndex?: number;
};

type SubmitMarkPayload = {
  sceneIndex: number;
};

type SubmitGuessesPayload = {
  guesses: PlainObject;
};

type HGuess = {
  weaponId: string;
  evidenceId: string;
};

type GuessHistoryEntry = {
  weaponId: string;
  evidenceId: string;
  status: string;
  groupIndex: number;
};

type HHistory = {
  [key: string]: GuessHistoryEntry[];
};

type HResults = {
  [key: string]: StringDictionary;
};
