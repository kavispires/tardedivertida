/**
 * Game info type for each game
 */
export type GameInfo = {
  gameCode: GameCode;
  gameName: GameName;
  version: string;
  title: DualLanguageValue;
  popularName: DualLanguageValue;
  basedOn: string;
  summary: DualLanguageValue;
  appearance: {
    clouds: string;
    color: string;
    backgroundColor?: string;
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
  available: boolean;
  options?: {
    label: string;
    key: string;
    on: string;
    off: string;
    description?: string;
    disabled?: boolean;
  }[];
  mobileFriendly?: boolean;
};
