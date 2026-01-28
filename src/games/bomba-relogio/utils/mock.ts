// Types
import type { GameRound } from 'types/game';
// Internal
import type { ROLES } from './constants';
import type { DataCounts, Declaration, Status, TimeBombCard } from './types';

/**
 * Generates the best declaration for a player based on their role and cards
 */
export function mockDeclaration(
  playerId: PlayerId,
  role: (typeof ROLES)[keyof typeof ROLES],
  hand: TimeBombCard[],
  dataCounts: DataCounts,
  status: Status,
  round: GameRound,
): Declaration {
  // If status.revealed is 0, it's the first round
  const isFirstRound = status.revealed === 0;
  const finalRound = round.current === round.total;
  // Max red wires left
  const maxWiresLeft = dataCounts.wires - status.revealed;

  // Rules
  // There's a maximum of 1 bomb
  // Players never declare having more wires than there are actually available. Red wires
  // Players normally don't declare the bomb in the first or second round, even if they are part of the Squad. It's too risky to have the Terrorists choosing to examine them.
  // Agent players always tell the truth about their Red Wires, unless they have the bomb which they say 0 Red wires
  // Terrorists always declare 1 less red wire if they have more than 1, unless it's the first round, which they always say they have at least 1.
  // Terrorists lie if they have only 1 Red wire. Either saying 0, or saying 2.
  // Terrorists declare they have 1 Red wire whenever they have the bomb plus one red wire for each actual Red wire they have.

  // Count actual cards in hand
  const actualBombs = hand.filter((card) => card.type === 'bomb').length;
  const actualWires = hand.filter((card) => card.type === 'wire').length;

  let declaredBombs = 0;
  let declaredWires = 0;

  if (role === 'agent') {
    // Agents tell the truth about wires
    declaredWires = actualWires;

    // Agents lie about having the bomb (say 0 wires instead)
    if (actualBombs > 0) {
      declaredWires = 0;
      // Don't declare bomb in first or second round
      if (finalRound) {
        declaredBombs = actualBombs;
      }
    }
  } else if (role === 'terrorist') {
    // Terrorists have complex lying rules
    if (actualBombs > 0) {
      // When terrorist has the bomb, declare 1 wire per actual red wire
      declaredWires = actualWires;
      // Don't declare bomb in first or second round
      if (finalRound) {
        declaredBombs = actualBombs;
      }
    } else if (actualWires === 0) {
      // No wires, declare truthfully
      declaredWires = 0;
    } else if (actualWires === 1) {
      // Lie about having 1 wire - say either 0 or 2
      // Choose 2 if it doesn't exceed max, otherwise 0
      declaredWires = maxWiresLeft >= 2 ? 2 : 0;
    } else if (actualWires > 1) {
      if (isFirstRound) {
        // First round: always say at least 1
        declaredWires = Math.max(1, actualWires - 1);
      } else {
        // Other rounds: declare 1 less
        declaredWires = actualWires - 1;
      }
    }
  }

  // Never declare more wires than available
  declaredWires = Math.min(declaredWires, maxWiresLeft);

  return {
    playerId,
    bombs: declaredBombs,
    wires: declaredWires,
  };
}
