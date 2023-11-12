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

type SuspectCardsOptions = {
  /**
   * Uses the official cards otherwise the TD cartoon ones
   */
  official?: boolean;
  /**
   * Uses the realistic AI cards otherwise any previous setting
   */
  realistic?: boolean;
  /**
   * Uses the models (everyone is beautiful) cards otherwise any previous setting
   */
  models?: boolean;
  /**
   * Uses the wacky cards otherwise any previous setting
   */
  wacky?: boolean;
};
