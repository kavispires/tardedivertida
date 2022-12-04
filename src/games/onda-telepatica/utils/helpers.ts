import clsx from 'clsx';
import { LETTERS } from 'utils/constants';

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
): string => {
  const baseBracketClass = 'o-dial-numbers';
  const modifier = num % 2 === 0 ? 'even' : 'odd';
  return clsx(
    baseBracketClass,
    `${baseBracketClass}--${modifier}`,
    showNeedle && needle === num && `${baseBracketClass}--active`,
    showTarget && target === num && `${baseBracketClass}--target`
  );
};

export const getTargetSide = (target: number, card: any, language: Language): string => {
  if (!card) {
    return '';
  }
  if (target === 0) {
    return language === 'pt' ? 'exatamente entre os dois' : 'exactly in between both ideas';
  }

  const side = target < 0 ? card.left : card.right;

  return language === 'pt' ? `do lado "${side}"` : `on the "${side}" side`;
};

export const getGuessResultClass = (guess: number, target: number): string => {
  const base = 'o-player-guess__guess';
  if (target - guess === 0) return `${base}--blue`;
  if (Math.abs(target - guess) === 1) return `${base}--orange`;
  if (Math.abs(target - guess) === 2) return `${base}--yellow`;
  return '';
};

export const getPoints = (guess: number, target: number): number => {
  if (target - guess === 0) return 4;
  if (Math.abs(target - guess) === 1) return 3;
  if (Math.abs(target - guess) === 2) return 2;
  return 0;
};

/**
 * Counts how many difference guesses are there
 */
export const countDifferentGuesses = (regularPlayers: GamePlayer[]): number => {
  const dict: Record<string, number> = {};

  regularPlayers.forEach((player) => {
    if (dict[String(player.guess)] === undefined) {
      dict[String(player.guess)] = 0;
    }
    dict[String(player.guess)] += 1;
  });

  return Object.keys(dict).length;
};
