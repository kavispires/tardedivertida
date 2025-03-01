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

export type DateKey = string; // Format YYYY-MM-DD

export type DailyResponse = {
  'aqui-o'?: DailyAquiOEntry;
  'arte-ruim'?: DailyArteRuimEntry;
  artista?: DailyPicacoEntry;
  palavreado?: DailyPalavreadoEntry;
  filmaco?: DailyFilmacoEntry;
  'controle-de-estoque': DailyControleDeEstoqueEntry;
  'teoria-de-conjuntos': DailyTeoriaDeConjuntosEntry;
  'comunicacao-alienigena': DailyComunicacaoAlienigenaEntry;
  'ta-na-cara': DailyTaNaCaraEntry;
  quartetos?: DailyQuartetosEntry;
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
   * Other values like hearts, goal, etc
   */
  [key: string]: any;
}
