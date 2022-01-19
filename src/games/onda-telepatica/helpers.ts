import clsx from 'clsx';
import { LETTERS } from '../../utils/constants';

export const getColorModifier = (letter: string) => {
  const index = LETTERS.indexOf(letter);
  return Math.abs(index) % 4;
};

export const getBracketClass = (
  num: number,
  showNeedle: boolean,
  needle: number,
  showTarget: boolean,
  target: number
) => {
  const baseBracketClass = 'o-dial-numbers';
  const modifier = num % 2 === 0 ? 'even' : 'odd';
  return clsx(
    baseBracketClass,
    `${baseBracketClass}--${modifier}`,
    showNeedle && needle === num && `${baseBracketClass}--active`,
    showTarget && target === num && `${baseBracketClass}--target`
  );
};

export const getTargetSide = (target: number, card: any, language: Language) => {
  if (!card) {
    return '';
  }
  if (target === 0) {
    return language === 'pt' ? 'exatamente entre os dois' : 'exactly in between both ideas';
  }

  const side = target < 0 ? card.left : card.right;

  return language === 'pt' ? `do lado "${side}"` : `on the "${side}" side`;
};
