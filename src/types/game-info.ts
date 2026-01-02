/**
 * Game info type for each game
 */
export type GameInfo = {
  gameCode: GameCode;
  gameName: GameName;
  version: string;
  release: string;
  available: boolean;
  title: DualLanguageValue;
  popularName: DualLanguageValue;
  inspiredBy: string;
  summary: DualLanguageValue;
  appearance: {
    clouds: string;
    cloudsAnimationType: string;
    colorScheme: ColorScheme;
    primaryColor: string;
    surfaceColor?: string;
    videoBackground: boolean;
  };
  rules: {
    pt: string[];
    en: string[];
  };
  playerCount: {
    best?: number;
    recommended: number[];
    min: number;
    max: number;
  };
  duration?: {
    base: number;
    perPlayer: number;
  };
  tags: string[];
  options?: GameInfoOption[];
};

export type GameInfoOption = {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
  // 'switch' | 'checkbox' | 'radio'
  kind: string;
  values: {
    label: string;
    value: string | boolean;
  }[];
};
