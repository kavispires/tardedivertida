import { AdedanhxGrid, Answer } from './types';

export const buildAnswerSheet = (grid: AdedanhxGrid) => {
  const answerSheet: Record<string, Answer> = {};
  grid.xHeaders.forEach((_, x) => {
    grid.yHeaders.forEach((_, y) => {
      const id = `${x}-${y}`;
      answerSheet[id] = {
        id,
        answer: '',
        timestamp: 0,
      };
    });
  });
  return answerSheet;
};
