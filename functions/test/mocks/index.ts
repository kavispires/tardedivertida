import { ArteRuimCard, TextCard } from '../../src/types/tdr';

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

export const mockUseSoIssoCardDatabase: TextCard[] = Array(100)
  .fill(1)
  .map((element, index) => {
    const id = `u-${element + index}-br`;
    return {
      id,
      text: `blah ${element + index}`,
    };
  }, {});
