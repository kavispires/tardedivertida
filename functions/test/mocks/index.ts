import { ArteRuimCard } from '../../src/engine/arte-ruim/types';
import { Word } from '../../src/engine/ue-so-isso/types';
import { CardId } from '../../src/utils/types';

export const mockArteRuimCardDatabase: Record<CardId, ArteRuimCard> = Array(120)
  .fill(1)
  .reduce((acc, element, index) => {
    const id = `a-${element + index}-br`;
    acc[id] = {
      id,
      text: `blah ${element + index}`,
      level: ((element + index) % 3) + 1,
    };
    return acc;
  }, {});

export const mockUseSoIssoCardDatabase: Record<CardId, Word> = Array(100)
  .fill(1)
  .reduce((acc, element, index) => {
    const id = `u-${element + index}-br`;
    acc[id] = {
      id,
      text: `blah ${element + index}`,
    };

    return acc;
  }, {});
