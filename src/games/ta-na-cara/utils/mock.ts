// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getRandomItem } from 'utils/helpers';

export function mockCharacterSelection(options: string[]) {
  return getRandomItem(options);
}

export function mockGuesses(userId: PlayerId, players: GamePlayers, grid: string[]) {
  // For each player it should have a 70% of getting it right
  return Object.keys(players).reduce((acc: Dictionary<string>, playerId) => {
    if (userId === playerId) return acc;

    acc[playerId] = Math.random() < 0.7 ? getRandomItem(grid) : players[playerId].identity.identityId;

    return acc;
  }, {});
}

export function mockAnswer() {
  return getRandomItem([-3, -3 - 1, 1, 3, 3]);
}
