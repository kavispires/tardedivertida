// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  guesses: string[];
};

export type DailyMapeamentoEntry = {
  id: DateKey;
  number: number;
  type: 'mapeamento';
  language: Language;
  location: string;
  clues: string[];
};

// Player must guess the secret location by seeing a clue and typing it
// If they typed the correct name they win
// If they are wrong, they lose a hard, see a new clue, and the correct letters are revealed part of the name of the location (tbd how this works)
