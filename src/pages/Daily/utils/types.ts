import type { ComponentType, SVGProps } from 'react';
// Internal
import type { DailyAquiOEntry } from '../games/AquiO/utils/types';
import type { DailyArteRuimEntry } from '../games/ArteRuim/utils/types';
import type { DailyPicacoEntry } from '../games/Picaco/utils/types';
import type { DailyEstoquistaEntry } from '../games/Estoquista/utils/types';
import type { DailyFilmacoEntry } from '../games/Filmaco/utils/types';
import type { DailyPalavreadoEntry } from '../games/Palavreado/utils/types';
import type { DailyConjuntosEntry } from '../games/Conjuntos/utils/types';
import type { DailyAlienadoEntry } from '../games/Alienado/utils/types';
import type { DailyQuartetosEntry } from '../games/Quartetos/utils/types';
import type { DailyTaNaCaraEntry } from '../games/TaNaCara/utils/types';
import type { DailyPortaisEntry } from '../games/Portais/utils/types';
import type { DailyOrganikuEntry } from '../games/Organiku/utils/types';
import type { DailyInvestigacaoEntry } from '../games/Investigacao/utils/types';
import type { DailyVitralEntry } from '../games/Vitral/utils/types';
import type { DailyConexoesEntry } from '../games/Conexoes/utils/types';

export type DateKey = string; // Format YYYY-MM-DD

export type DailyResponse = {
  id: string;
  // Games
  'arte-ruim': DailyArteRuimEntry;
  'aqui-o': DailyAquiOEntry;
  alienado: DailyAlienadoEntry;
  estoquista: DailyEstoquistaEntry;
  investigacao: DailyInvestigacaoEntry;
  filmaco: DailyFilmacoEntry;
  organiku?: DailyOrganikuEntry;
  palavreado: DailyPalavreadoEntry;
  portais: DailyPortaisEntry;
  quartetos: DailyQuartetosEntry;
  conjuntos: DailyConjuntosEntry;
  vitral?: DailyVitralEntry;
  // Contributions
  conexoes: DailyConexoesEntry;
  picaco: DailyPicacoEntry;
  'ta-na-cara': DailyTaNaCaraEntry;
  // Other
  dictionary?: Dictionary<string>;
};

export type LetterState = 'correct' | 'incorrect' | 'intermediate' | 'used' | 'idle';

export type Letter = {
  letter: string;
  state: LetterState;
  disabled?: boolean;
};

export type LettersDictionary = Dictionary<Letter>;

export interface WithRequiredId {
  id: string;
}

/**
 * Streak tracking data for daily games.
 * Tracks consecutive days played (playing any game counts).
 */
export type DailyStreakData = {
  /**
   * Current consecutive days streak
   */
  currentStreak: number;
  /**
   * Longest streak ever achieved
   */
  longestStreak: number;
  /**
   * Total days played (non-consecutive)
   */
  totalDaysPlayed: number;
  /**
   * Last date a game was played (YYYY-MM-DD)
   */
  lastPlayedDate: DateKey | null;
  /**
   * History of which games were played on each date
   * Limited to last 30 days to manage storage size
   */
  history: {
    [date: DateKey]: string[]; // Array of game KEYs played on that date
  };
  /**
   * Last date streak was calculated (to avoid recalculating on every load)
   */
  lastCalculatedDate: DateKey | null;
};

export interface GameSettings {
  /**
   * Unique key for the game used for local storage
   */
  KEY: string;
  /**
   * Daily game route
   */
  ROUTE: string;
  /**
   * Game type
   */
  TYPE: 'game' | 'contribution';
  /**
   * Game box hub color
   */
  COLOR: string;
  /**
   * Game emoji
   */
  EMOJI: string;
  /**
   * Game icon
   */
  HUB_ICON: ComponentType<SVGProps<SVGSVGElement>>;
  /**
   * Game name
   */
  NAME: DualLanguageValue;
  /**
   * Game tagline
   */
  TAGLINE: DualLanguageValue;
  /**
   * The day the game was released
   */
  RELEASE_DATE: DateKey;
  /**
   * Whether the game is in demo mode
   */
  VERSION?: 'stable' | 'beta' | 'demo' | 'maintenance' | 'disabled' | 'soon';
  /**
   * Other values like hearts, goal, etc
   */
  [key: string]: any;
}

/**
 * Represents the options for the basic results of a daily game.
 */
export type BasicResultsOptions = {
  /**
   * The game name to be displayed in the result
   */
  type: string;
  /**
   * The challenge number for the game
   */
  challengeNumber: number;
  /**
   * The language in which the result is written
   */
  language: Language;
  /**
   * The total number of hearts available
   */
  totalHearts: number;
  /**
   * The number of remaining hearts
   */
  remainingHearts: number;
  /**
   * The title of the game
   */
  title?: string;
  /**
   * Whether to include the link to the game in the result
   */
  hideLink?: boolean;
  /**
   * Whether to include the hearts to the game in the result
   */
  hideHearts?: boolean;
};
