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
import type { DailyMapeamentoEntry } from '../games/Mapeamento/utils/types';
import type { DailyPanicoEntry } from '../games/Panico/utils/types';
import type { DailyPirralhosEntry } from '../games/Pirralhos/utils/types';

export type DateKey = string; // Format YYYY-MM-DD

/**
 * Games entries as delivered by the new nested server response shape.
 */
type ChallengesEntries = {
  'arte-ruim'?: DailyArteRuimEntry;
  'aqui-o'?: DailyAquiOEntry;
  alienado?: DailyAlienadoEntry;
  investigacao?: DailyInvestigacaoEntry;
  filmaco?: DailyFilmacoEntry;
  mapeamento?: DailyMapeamentoEntry;
  organiku?: DailyOrganikuEntry;
  palavreado?: DailyPalavreadoEntry;
  panico?: DailyPanicoEntry;
  portais?: DailyPortaisEntry;
  quartetos?: DailyQuartetosEntry;
  conjuntos?: DailyConjuntosEntry;
  vitral?: DailyVitralEntry;
  pirralhos?: DailyPirralhosEntry;
};

/**
 * Contribution entries as delivered by the new nested server response shape.
 */
type ContributionsEntries = {
  picaco?: DailyPicacoEntry;
  'ta-na-cara'?: DailyTaNaCaraEntry;
};

/**
 * The flat response shape used throughout the app.
 * This is the normalized shape produced by `normalizeDailyResponse`,
 * regardless of whether the server sent the legacy flat shape or the
 * new nested shape (see `NewDailyResponse`).
 */
export type DailyResponse = {
  id: string;
  // Games
  'arte-ruim': DailyArteRuimEntry;
  'aqui-o': DailyAquiOEntry;
  alienado: DailyAlienadoEntry;
  investigacao: DailyInvestigacaoEntry;
  filmaco: DailyFilmacoEntry;
  mapeamento: DailyMapeamentoEntry;
  organiku: DailyOrganikuEntry;
  palavreado: DailyPalavreadoEntry;
  panico?: DailyPanicoEntry;
  pirralhos?: DailyPirralhosEntry;
  portais: DailyPortaisEntry;
  quartetos: DailyQuartetosEntry;
  conjuntos: DailyConjuntosEntry;
  vitral: DailyVitralEntry;
  // Contributions
  picaco: DailyPicacoEntry;
  'ta-na-cara': DailyTaNaCaraEntry;
  // Deprecated
  estoquista?: DailyEstoquistaEntry;
  conexoes?: DailyConexoesEntry;
  // Other
  dictionary?: Dictionary<string>;
};

/**
 * The new nested response shape sent by the server once the migration is complete.
 */
export type NewDailyResponse = {
  id: DateKey;
  // Games
  challenges: ChallengesEntries;
  // Contributions
  contributions: ContributionsEntries;
  // Additional info
  metadata?: {
    dictionary?: Dictionary<string>;
  };
};

/**
 * The raw shape the API may return during the migration period:
 * either the legacy flat shape or the new nested shape.
 */
export type RawDailyResponse = DailyResponse | NewDailyResponse;

/**
 * Type guard that distinguishes the new nested response shape from the legacy flat one.
 */
function isNewDailyResponse(data: RawDailyResponse): data is NewDailyResponse {
  return 'challenges' in data && 'contributions' in data;
}

/**
 * Normalizes a raw daily response (legacy flat shape or new nested shape) into
 * the flat `DailyResponse` shape consumed by the rest of the app.
 */
export function normalizeDailyResponse(data: RawDailyResponse): DailyResponse {
  if (!isNewDailyResponse(data)) {
    return data;
  }

  return {
    id: data.id,
    ...data.challenges,
    ...data.contributions,
    dictionary: data.metadata?.dictionary,
  } as DailyResponse;
}

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
  /**
   * Last date the milestone modal was displayed (YYYY-MM-DD)
   * Used to prevent showing the modal multiple times in the same day
   */
  lastMilestoneModalDisplayedDate: DateKey | null;
  /**
   * The highest milestone that has been celebrated
   * Used to prevent showing the same milestone modal multiple times
   */
  lastCelebratedMilestone: number | null;
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
  TYPE: 'game' | 'contribution' | 'special';
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
  VERSION: 'stable' | 'beta' | 'demo' | 'maintenance' | 'disabled' | 'soon' | 'unreleased';
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
