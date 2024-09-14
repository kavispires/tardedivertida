// Internal
import type { CardEntry } from './types';

export function isEarliestPlayerWithFewestCards(
  table: CardEntry[],
  userId: PlayerId,
  turnOrder: PlayerId[]
): boolean {
  for (let i = 0; i < Math.max(table.length, turnOrder.length); i++) {
    if (!table[i]) {
      return true;
    }

    if (!table[i] || table[i].cards[0] === '') {
      return table[i].playerId === userId;
    }
  }

  for (let i = 0; i < table.length; i++) {
    if (table[i].cards[1] === '') {
      return table[i].playerId === userId;
    }
  }
  return false;
}
