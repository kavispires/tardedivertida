import type { ComponentType, SVGProps } from 'react';
// Internal
import type { DailyAquiOEntry } from '../games/AquiO/utils/types';
import type { DailyArteRuimEntry } from '../games/ArteRuim/utils/types';
import type { DailyPicacoEntry } from '../games/Picaco/utils/types';
import type { DailyControleDeEstoqueEntry } from '../games/ControleDeEstoque/utils/types';
import type { DailyFilmacoEntry } from '../games/Filmaco/utils/types';
import type { DailyPalavreadoEntry } from '../games/Palavreado/utils/types';
import type { DailyTeoriaDeConjuntosEntry } from '../games/TeoriaDeConjuntos/utils/types';
import type { DailyComunicacaoAlienigenaEntry } from '../games/ComunicacaoAlienigena/utils/types';
import type { DailyQuartetosEntry } from '../games/Quartetos/utils/types';
import type { DailyTaNaCaraEntry } from '../games/TaNaCara/utils/types';
import type { DailyPortaisMagicosEntry } from '../games/PortaisMagicos/utils/types';
import type { DailyOrganikuEntry } from '../games/Organiku/utils/types';
import type { DailyEspionagemEntry } from '../games/Espionagem/utils/types';

export type DateKey = string; // Format YYYY-MM-DD

export type DailyResponse = {
  // Games
  'arte-ruim': DailyArteRuimEntry;
  'aqui-o': DailyAquiOEntry;
  'comunicacao-alienigena': DailyComunicacaoAlienigenaEntry;
  'controle-de-estoque': DailyControleDeEstoqueEntry;
  espionagem: DailyEspionagemEntry;
  filmaco: DailyFilmacoEntry;
  organiku?: DailyOrganikuEntry;
  palavreado: DailyPalavreadoEntry;
  'portais-magicos': DailyPortaisMagicosEntry;
  quartetos: DailyQuartetosEntry;
  'teoria-de-conjuntos': DailyTeoriaDeConjuntosEntry;
  // Contributions
  artista: DailyPicacoEntry;
  'ta-na-cara': DailyTaNaCaraEntry;
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
   * Game hub short name
   */
  HUB_NAME: DualLanguageValue;
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
