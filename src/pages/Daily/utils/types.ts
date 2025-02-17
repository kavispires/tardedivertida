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

export type DateKey = string; // Format YYYY-MM-DD

export type DailyResponse = {
  'aqui-o'?: DailyAquiOEntry;
  'arte-ruim'?: DailyArteRuimEntry;
  artista?: DailyPicacoEntry;
  palavreado?: DailyPalavreadoEntry;
  filmaco?: DailyFilmacoEntry;
  'controle-de-estoque'?: DailyControleDeEstoqueEntry;
  'teoria-de-conjuntos'?: DailyTeoriaDeConjuntosEntry;
  'comunicacao-alienigena'?: DailyComunicacaoAlienigenaEntry;
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
