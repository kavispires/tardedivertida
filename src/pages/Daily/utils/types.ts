import { DailyAquiOEntry } from '../games/AquiO/utils/types';
import { DailyArteRuimEntry } from '../games/ArteRuim/utils/types';
import { DailyArtistaEntry } from '../games/Artista/utils/types';
import { DailyControleDeEstoqueEntry } from '../games/ControleDeEstoque/utils/types';
import { DailyFilmacoEntry } from '../games/Filmaco/utils/types';
import { DailyPalavreadoEntry } from '../games/Palavreado/utils/types';

export type DateKey = string; // Format YYYY-MM-DD

export type DailyResponse = {
  'aqui-o': DailyAquiOEntry;
  'arte-ruim': DailyArteRuimEntry;
  artista: DailyArtistaEntry;
  palavreado: DailyPalavreadoEntry;
  filmaco: DailyFilmacoEntry;
  'controle-de-estoque': DailyControleDeEstoqueEntry;
};

export type LetterState = 'correct' | 'incorrect' | 'intermediate' | 'used' | 'idle';

export type Letter = {
  letter: string;
  state: LetterState;
  disabled?: boolean;
};

export type LettersDictionary = Dictionary<Letter>;
