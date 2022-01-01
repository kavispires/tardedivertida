type CrimesHediondosCard = {
  id: string;
  type: string;
  name: DualLanguageValue;
};

type GroupedItems = {
  [key: string]: string[];
};

type Items = {
  [key: string]: CrimesHediondosCard;
};

type SceneTile = {
  id: string;
  type: string;
  title: DualLanguageValue;
  values: DualLanguageValue[];
  specific?: string | null;
};

type SceneTilePayload = {
  tileId: string;
  value: number;
};
