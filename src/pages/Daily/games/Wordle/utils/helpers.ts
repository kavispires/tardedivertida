import { Letter } from 'pages/Daily/utils/types';
import { SETTINGS } from './settings';

export const getArteRuimName = (language: Language) => {
  return language === 'pt' ? 'Palavreado' : 'Wordling';
};

export const generateGrid = () => {
  const grid: Letter[][] = [];
  for (let i = 0; i < SETTINGS.HEARTS; i++) {
    grid[i] = [];
    for (let j = 0; j < SETTINGS.WORD_LENGTH; j++) {
      grid[i][j] = {
        letter: ' ',
        state: 'idle',
      };
    }
  }
  return grid;
};
