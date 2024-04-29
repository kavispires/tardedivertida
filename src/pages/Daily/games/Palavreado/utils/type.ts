import { DateKey } from 'pages/Daily/utils/types';

export type DailyPalavreadoEntry = {
  id: DateKey;
  number: number;
  type: 'palavreado';
  language: Language;
  text: 'troço';
};

export type Letter = {
  letter: string;
  state: 'idle' | 'correct' | 'incorrect' | 'intermediate' | 'used' | 'disabled';
};
