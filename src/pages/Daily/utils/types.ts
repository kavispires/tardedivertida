import type { ComponentType, SVGProps } from 'react';
// Internal
import type { DailyAquiOEntry } from '../games/AquiO/utils/types';
import type { DailyArteRuimEntry } from '../games/ArteRuim/utils/types';
import type { DailyPicacoEntry } from '../games/Picaco/utils/types';
import type { DailyEstoquistaEntry, DailyControleDeEstoqueEntry } from '../games/Estoquista/utils/types';
import type { DailyFilmacoEntry } from '../games/Filmaco/utils/types';
import type { DailyPalavreadoEntry } from '../games/Palavreado/utils/types';
import type { DailyConjuntosEntry, DailyTeoriaDeConjuntosEntry } from '../games/Conjuntos/utils/types';
import type { DailyAlienadoEntry, DailyComunicacaoAlienigenaEntry } from '../games/Alienado/utils/types';
import type { DailyQuartetosEntry } from '../games/Quartetos/utils/types';
import type { DailyTaNaCaraEntry } from '../games/TaNaCara/utils/types';
import type { DailyPortaisEntry, DailyPortaisMagicosEntry } from '../games/Portais/utils/types';
import type { DailyOrganikuEntry } from '../games/Organiku/utils/types';
import type { DailyInvestigacaoEntry, DailyEspionagemEntry } from '../games/Investigacao/utils/types';
import type { DailyVitralEntry, DailyVitraisEntry } from '../games/Vitral/utils/types';
import type { DailyConexoesEntry } from '../games/Conexoes/utils/types';

export type DateKey = string; // Format YYYY-MM-DD

export type DailyResponse = {
  id: string;
  // Games
  'arte-ruim': DailyArteRuimEntry;
  'aqui-o': DailyAquiOEntry;
  'comunicacao-alienigena': DailyComunicacaoAlienigenaEntry; // Backwards compatibility
  alienado: DailyAlienadoEntry;
  'controle-de-estoque': DailyControleDeEstoqueEntry; // Backwards compatibility
  estoquista: DailyEstoquistaEntry;
  espionagem: DailyEspionagemEntry; // Backwards compatibility
  investigacao: DailyInvestigacaoEntry;
  filmaco: DailyFilmacoEntry;
  organiku?: DailyOrganikuEntry;
  palavreado: DailyPalavreadoEntry;
  'portais-magicos': DailyPortaisMagicosEntry; // Backwards compatibility
  portais: DailyPortaisEntry;
  quartetos: DailyQuartetosEntry;
  'teoria-de-conjuntos': DailyTeoriaDeConjuntosEntry; // Backwards compatibility
  conjuntos: DailyConjuntosEntry;
  vitrais?: DailyVitraisEntry; // Backwards compatibility
  vitral?: DailyVitralEntry;
  // Contributions
  artista: DailyPicacoEntry; // Backwards compatibility
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
