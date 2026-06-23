import { ArteRuimCardData, TextCardData } from '../../src/types/tdr';

export const mockArteRuimCardDatabase: Record<UID, ArteRuimCardData> = Array(120)
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

export const mockUseSoIssoCardDatabase: TextCardData[] = Array(100)
  .fill(1)
  .map((element, index) => {
    const id = `u-${element + index}-br`;
    return {
      id,
      text: `blah ${element + index}`,
    };
  }, {});
