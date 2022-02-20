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
  locationIndex?: string;
};

type SubmitMarkPayload = {
  sceneIndex: number;
};

type SubmitGuessesPayload = {
  guesses: PlainObject;
};

type Guess = {
  weaponId: string;
  evidenceId: string;
  isComplete: boolean;
};
