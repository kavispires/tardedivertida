import { ArteRuimCardsDatabase } from '../../src/engine/arte-ruim/interfaces';
import { PlainObject } from '../../src/utils/interfaces';

export const mockArteRuimCardDatabase: ArteRuimCardsDatabase = Array(120)
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

export const mockUseSoIssoCardDatabase: PlainObject = Array(100)
  .fill(1)
  .reduce((acc, element, index) => {
    const id = `u-${element + index}-br`;
    acc[id] = {
      id,
      text: `blah ${element + index}`,
    };

    return acc;
  }, {});
