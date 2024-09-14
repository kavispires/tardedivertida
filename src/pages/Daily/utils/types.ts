import { DailyAquiOEntry } from '../games/AquiO/utils/types';
import { DailyArteRuimEntry } from '../games/ArteRuim/utils/types';
import { DailyPicacoEntry } from '../games/Picaco/utils/types';
import { DailyControleDeEstoqueEntry } from '../games/ControleDeEstoque/utils/types';
import { DailyFilmacoEntry } from '../games/Filmaco/utils/types';
import { DailyPalavreadoEntry } from '../games/Palavreado/utils/types';
import { DailyTeoriaDeConjuntosEntry } from '../games/TeoriaDeConjuntos/utils/types';

export type DateKey = string; // Format YYYY-MM-DD

export type DailyResponse = {
  'aqui-o': DailyAquiOEntry;
  'arte-ruim': DailyArteRuimEntry;
  artista: DailyPicacoEntry;
  palavreado: DailyPalavreadoEntry;
  filmaco: DailyFilmacoEntry;
  'controle-de-estoque': DailyControleDeEstoqueEntry;
  'teoria-de-conjuntos'?: DailyTeoriaDeConjuntosEntry;
};

export type DailyGameStatus = 'idle' | 'playing' | 'played';

export type LetterState = 'correct' | 'incorrect' | 'intermediate' | 'used' | 'idle';

export type Letter = {
  letter: string;
  state: LetterState;
  disabled?: boolean;
};

export type LettersDictionary = Dictionary<Letter>;

export interface WithRequiredId {
  id: string;
  status?: DailyGameStatus;
}
