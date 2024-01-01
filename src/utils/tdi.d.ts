type CrimesHediondosCard = {
  id: CardId;
  type: string;
  name: DualLanguageValue;
  tags?: string[];
};

type MonsterCard = {
  id: string;
  orientation: string;
};

type SuspectCard = {
  id: CardId;
  name: DualLanguageValue;
  gender: string;
  ethnicity: string;
  age: string;
};
