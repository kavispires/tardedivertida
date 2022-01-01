type CrimesHediondosCard = {
  id: string;
  type: string;
  name: DualLanguageValue;
};

type GroupedItems = {
  [key: string]: string[];
};

type ItemsDict = {
  [key: string]: CrimesHediondosCard;
};

type SceneTile = {
  id: string;
  type: string;
  title: DualLanguageValue;
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
