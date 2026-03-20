/**
 * Game info type for each game
 */
export type GameInfo = {
  /**
   * Unique code identifier for the game
   */
  gameCode: string;
  /**
   * Internal name of the game
   */
  gameName: string;
  /**
   * Current version of the game
   */
  version: string;
  /**
   * Release status of the game
   */
  release: string;
  /**
   * Date when the game was released
   */
  releaseDate: string;
  /**
   * Whether the game is currently available to play
   */
  available: boolean;
  /**
   * Game title in multiple languages
   */
  title: DualLanguageValue;
  /**
   * Popular or alternative name for the game
   */
  popularName: DualLanguageValue;
  /**
   * Source or inspiration for the game
   */
  inspiredBy: string;
  /**
   * Brief summary of the game in multiple languages
   */
  summary: DualLanguageValue;
  /**
   * Visual appearance configuration for the game
   */
  appearance: {
    /**
     * Cloud pattern or style
     */
    clouds: string;
    /**
     * Animation type for the clouds
     */
    cloudsAnimationType: string;
    /**
     * Color scheme for the game interface
     */
    colorScheme: ColorScheme;
    /**
     * Primary color used in the game theme
     */
    primaryColor: string;
    /**
     * Surface color used in the game theme
     */
    surfaceColor?: string;
    /**
     * Whether to show video background
     */
    videoBackground: boolean;
    /**
     * Whether to show image background during the game main phases (not lobby, setup, or game_over)
     */
    imageBackground?: boolean;
  };
  /**
   * Game rules in multiple languages
   */
  rules: {
    /**
     * Rules in Portuguese
     */
    pt: string[];
    /**
     * Rules in English
     */
    en: string[];
  };
  /**
   * Player count configuration
   */
  playerCount: {
    /**
     * Optimal number of players
     */
    best?: number;
    /**
     * Recommended player counts
     */
    recommended: number[];
    /**
     * Minimum number of players
     */
    min: number;
    /**
     * Maximum number of players
     */
    max: number;
  };
  /**
   * Game duration estimate
   */
  duration?: {
    /**
     * Base duration in minutes
     */
    base: number;
    /**
     * Additional minutes per player
     */
    perPlayer: number;
  };
  /**
   * List of game mechanics
   */
  mechanics: string[];
  /**
   * List of game features
   */
  features: string[];
  /**
   * Optional game configuration options
   */
  options?: GameInfoOption[];
};

/**
 * Configuration option for a game
 */
export type GameInfoOption = {
  /**
   * Unique key for the option
   */
  key: string;
  /**
   * Display label for the option
   */
  label: string;
  /**
   * Optional description of the option
   */
  description?: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
  /**
   * Type of option control
   */
  kind: 'switch' | 'checkbox' | 'radio' | string;
  /**
   * Available values for the option
   */
  values: {
    /**
     * Display label for the value
     */
    label: string;
    /**
     * Actual value
     */
    value: string | boolean;
  }[];
};
