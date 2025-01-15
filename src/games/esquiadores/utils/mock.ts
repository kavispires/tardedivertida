import { sample } from 'lodash';
import type { GamePlayers } from 'types/player';

export const mockChoices = (): string[] => {
  const choices = ['left', 'right'];
  return [sample(choices) ?? 'left', sample(choices) ?? 'right', sample(choices) ?? 'left'];
};

const pools: ArrayDictionary<number> = {
  0: [0, 1, 2, 3, 4, 5],
  1: [0, 1, 2, 3],
  2: [2, 3, 4, 5],
  3: [0, 1],
  4: [2, 3],
  5: [4, 5],
};
export const mockBets = (bettingChips: number, animateFrom: number): NumberDictionary => {
  const bets: NumberDictionary = {};

  const pool = pools[animateFrom];

  for (let i = 0; i < bettingChips; i++) {
    const lodge = sample(pool);
    if (lodge !== undefined) {
      bets[lodge] = (bets[lodge] ?? 0) + 1;
    }
  }

  return bets;
};

export const mockSkierBets = (
  bettingChips: number,
  players: GamePlayers,
  skierId: PlayerId,
): NumberDictionary => {
  const bets: NumberDictionary = {};

  const playersButSkier = Object.keys(players).filter((playerId) => playerId !== skierId);

  for (let i = 0; i < bettingChips; i++) {
    const player = sample(playersButSkier) ?? playersButSkier[0];
    bets[player] = (bets[player] ?? 0) + 1;
  }

  return bets;
};
