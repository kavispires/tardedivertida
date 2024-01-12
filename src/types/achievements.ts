export type AchievementKey = string;

export type Achievement = {
  type: string;
  playerId: PlayerId;
  value: Primitive;
};

export type AchievementInfo = {
  icon: string;
  title: DualLanguageValue;
  description?: DualLanguageValue;
};

export type AchievementReference = Record<string, AchievementInfo>;
