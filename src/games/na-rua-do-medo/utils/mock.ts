// Utils
import { getRandomItem } from 'utils/helpers';

const MORE_CONTINUE = ['CONTINUE', 'CONTINUE', 'CONTINUE', 'CONTINUE', 'GO_HOME'];
const MORE_HOME = ['GO_HOME', 'GO_HOME', 'CONTINUE', 'CONTINUE', 'CONTINUE'];

export const mockPlayerDecision = (horrorLength: number, hand: number) => {
  let decision = getRandomItem(MORE_CONTINUE);

  if (hand < 2 || horrorLength < 2) {
    decision = 'CONTINUE';
  } else if (horrorLength >= 3 && hand > 4) {
    decision = getRandomItem(MORE_HOME);
  }

  return decision;
};
