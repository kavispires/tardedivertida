import { DailyArteRuimEntry } from '../games/ArteRuim/utils/types';
import { DailyPalavreadoEntry } from '../games/Palavreado/utils/type';

export type DateKey = string; // Format YYYY-MM-DD

export type DailyResponse = {
  'arte-ruim': DailyArteRuimEntry;
  palavreado: DailyPalavreadoEntry;
};

export type LetterState = 'correct' | 'incorrect' | 'intermediate' | 'used' | 'disabled' | 'idle';
export type LettersDictionary = Dictionary<LetterState>;
