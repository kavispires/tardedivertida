// Types
import type { GamePlayers, GameRound } from 'types/game';
// Internal
import { ROLES, CARD_TYPES } from './constants';
import type { DataCounts, Declaration, Status, TimeBombCard } from './types';

/**
 * Generates an AI player's declaration about their hand contents during the Declaration phase.
 *
 * Global Rules:
 * - Max 1 Bomb: There is only ever a maximum of 1 bomb in play.
 * - Mathematical Limit: Never declare having more Red Wires than are currently left in the deck, nor more than cards in hand.
 * - Hide the Bomb: Never declare having the bomb in Round 1 or Round 2.
 *
 * Agent Rules (Good Team):
 * - Only Blanks: Always declare 0 Red Wires.
 * - Has Red Wires (No Bomb): Generally declare the exact, truthful number of Red Wires.
 * - Strategic Exaggeration: 20% chance to declare +1 Red Wire to forcefully attract examination.
 * - Has the Bomb (Last Round): Declare everything truthfully.
 * - Has the Bomb (<= 1 Red Wire, Not Last Round): Declare 0 Red Wires to avoid being picked.
 * - Has the Bomb (> 1 Red Wire, Not Last Round): Declare actual number of Red Wires minus 1.
 *
 * Terrorist Rules (Evil Team):
 * - Baseline Deception: 25% chance to tell the exact truth in any scenario to build false trust.
 * - First Round Aggression: Always declare having at least 1 Red Wire during Round 1.
 * - Has the Bomb (Baiting): Lie and claim actual Red Wires + 1 or + 2 to lure Agents.
 * - Only Blanks (Wasting Turns): Lie and claim 1 or 2 Red Wires to waste Agent examinations.
 * - Has 1 Red Wire (No Bomb): Lie and declare either 0 or 2 Red Wires.
 * - Has 2+ Red Wires (No Bomb): Declare 1 less Red Wire than you actually have.
 *
 * @param playerId - The unique identifier of the player making the declaration.
 * @param role - The role of the player (ROLES.AGENT or ROLES.TERRORIST).
 * @param hand - The actual array of cards currently held by the player.
 * @param dataCounts - Game distribution totals, used to calculate limits.
 * @param status - The current game status, used to calculate revealed wires.
 * @param round - Information about the current game round.
 * @returns An object containing the declared number of bombs and wires.
 */
export function mockDeclaration(
  playerId: UID,
  role: (typeof ROLES)[keyof typeof ROLES],
  hand: TimeBombCard[],
  dataCounts: DataCounts,
  status: Status,
  round: GameRound,
): Declaration {
  const actualWires = hand.filter((card) => card.type === CARD_TYPES.WIRE).length;
  const actualBombs = hand.filter((card) => card.type === CARD_TYPES.BOMB).length;

  const remainingWires = dataCounts.wires - status.revealed;
  const isLastRound = round.current === round.total || round.forceLastRound;

  let declaredWires = 0;
  let declaredBombs = 0;

  if (role === ROLES.AGENT) {
    if (actualBombs > 0) {
      if (isLastRound) {
        // Last Round Override: Complete Truth
        declaredWires = actualWires;
        declaredBombs = actualBombs;
      } else if (actualWires <= 1) {
        // Hide completely
        declaredWires = 0;
      } else {
        // Stay useful but lower profile
        declaredWires = actualWires - 1;
      }
    } else if (actualWires === 0) {
      // Only Blanks
      declaredWires = 0;
    } else {
      // Has Wires (No Bomb)
      const shouldExaggerate = Math.random() < 0.2;
      declaredWires = shouldExaggerate ? actualWires + 1 : actualWires;
    }
  } else if (role === ROLES.TERRORIST) {
    const tellTruth = Math.random() < 0.25;

    if (tellTruth) {
      declaredWires = actualWires;
      declaredBombs = actualBombs;
    } else {
      if (actualBombs > 0) {
        // Bait Agents by inflating wires
        const exaggeration = Math.random() < 0.5 ? 1 : 2;
        declaredWires = actualWires + exaggeration;
      } else if (actualWires === 0) {
        // Waste Agent turns
        declaredWires = Math.random() < 0.5 ? 1 : 2;
      } else if (actualWires === 1) {
        // Confuse the board
        declaredWires = Math.random() < 0.5 ? 0 : 2;
      } else {
        // Deflect attention slightly
        declaredWires = actualWires - 1;
      }
    }

    // First Round Aggression Override (unless they ended up telling the truth about 0 wires)
    if (round.current === 1 && declaredWires === 0 && !tellTruth) {
      declaredWires = 1;
    }
  }

  // Global Constraints & Limit Enforcement

  // 1. Never declare the bomb in Round 1 or 2
  if (round.current <= 2) {
    declaredBombs = 0;
  }

  // 2. Cannot declare more wires than mathematically possible in the remaining deck
  // 3. Cannot declare more total cards than are physically in the hand
  const maxPossibleWires = Math.min(remainingWires, hand.length - declaredBombs);

  declaredWires = Math.max(0, Math.min(declaredWires, maxPossibleWires));
  declaredBombs = Math.max(0, Math.min(declaredBombs, hand.length, 1));

  return {
    playerId,
    bombs: declaredBombs,
    wires: declaredWires,
  };
}

/**
 * Generates an AI player's choice of whom to examine based on current round declarations.
 *
 * Global Rules:
 * - Self-Exclusion: Never targets themselves.
 * - Valid Targets: Only targets players who still have cards in their hand.
 *
 * Agent Rules (Good Team):
 * - Bomb Avoidance: Filters out anyone who explicitly declared the Bomb.
 * - Chase the Wires: Prioritizes targets with the highest declared Red Wires.
 * - Tie-Breaker: Randomly selects among players tied for the highest declared wires.
 * - Desperation Protocol: If all valid targets claim 0 Red Wires, randomly targets
 *   a player who has the highest number of unrevealed cards (hand length).
 *
 * Terrorist Rules (Evil Team):
 * - Bomb Sniping: Instantly targets anyone who explicitly declared the Bomb.
 * - Camouflage (~60%): Mimics Agent behavior by targeting the highest declared Red Wires.
 * - Sabotage (~40%): Intentionally targets a player who declared 0 Red Wires to waste a turn.
 * - Fallback: Randomly selects if conditions for Sabotage aren't met.
 *
 * @param playerId - ID of the active player making the decision.
 * @param role - The role of the AI player (ROLES.AGENT or ROLES.TERRORIST).
 * @param dataCounts - Game distribution totals.
 * @param status - Current game status.
 * @param players - Dictionary of all players, their hands, and declarations.
 * @param round - Information about the current game round.
 * @returns The ID of the player chosen to be examined.
 */
export function mockTargetPlayerForExamination(
  playerId: UID,
  role: (typeof ROLES)[keyof typeof ROLES],
  dataCounts: DataCounts,
  status: Status,
  players: GamePlayers,
  round: GameRound,
): UID {
  // 1. Identify valid targets (exclude self, ensure they have cards left to cut)
  const targetIds = Object.keys(players).filter((id) => id !== playerId && players[id].hand.length > 0);

  // Fallback safety (should not happen in a normal game state)
  if (targetIds.length === 0) {
    return Object.keys(players).find((id) => id !== playerId) as UID;
  }

  // Utility to pick a random ID from an array of candidates
  const pickRandom = (candidates: UID[]): UID => {
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  if (role === ROLES.AGENT) {
    // Bomb Avoidance: exclude anyone who declared a bomb
    const safeTargets = targetIds.filter((id) => players[id].declarations.bombs === 0);

    // Edge case fallback: If everyone declared a bomb, we must pick someone anyway
    const consideredTargets = safeTargets.length > 0 ? safeTargets : targetIds;

    // Find the highest declared wires
    let maxDeclaredWires = -1;
    for (const id of consideredTargets) {
      if (players[id].declarations.wires > maxDeclaredWires) {
        maxDeclaredWires = players[id].declarations.wires;
      }
    }

    if (maxDeclaredWires > 0) {
      // Chase the Wires
      const topCandidates = consideredTargets.filter(
        (id) => players[id].declarations.wires === maxDeclaredWires,
      );
      return pickRandom(topCandidates);
    }
    // Desperation Protocol (Max declared wires is 0)
    // Pick based on highest unrevealed card count (hand.length)
    let maxHandLength = -1;
    for (const id of consideredTargets) {
      if (players[id].hand.length > maxHandLength) {
        maxHandLength = players[id].hand.length;
      }
    }

    const highestCardCountTargets = consideredTargets.filter(
      (id) => players[id].hand.length === maxHandLength,
    );
    return pickRandom(highestCardCountTargets);
  }

  if (role === ROLES.TERRORIST) {
    const remainingWires = dataCounts.wires - status.revealed;
    const isMatchPoint = remainingWires === 1;

    // Smarter Bomb Sniping (Check the round!)
    const bombDeclarers = targetIds.filter((id) => players[id].declarations.bombs > 0);
    // Only snipe if it's Round 3 or 4, OR if it's the last round. Early bombs are bluffs!
    if (bombDeclarers.length > 0 && round.current > 2) {
      return pickRandom(bombDeclarers);
    }

    // Smarter Camouflage (Check the status!)
    // If Agents only need 1 wire to win, NEVER camouflage. It's too dangerous.
    const isCamouflage = !isMatchPoint && Math.random() < 0.6;

    if (isCamouflage) {
      // Camouflage: Mimic Agent logic (Chase the Wires)
      let maxDeclaredWires = -1;
      for (const id of targetIds) {
        if (players[id].declarations.wires > maxDeclaredWires) {
          maxDeclaredWires = players[id].declarations.wires;
        }
      }
      const topCandidates = targetIds.filter((id) => players[id].declarations.wires === maxDeclaredWires);
      return pickRandom(topCandidates);
    }
    // Sabotage: Intentionally target 0 wires
    const zeroWireTargets = targetIds.filter((id) => players[id].declarations.wires === 0);

    if (zeroWireTargets.length > 0) {
      return pickRandom(zeroWireTargets);
    }
    // Fallback: If no one declared 0 wires, just pick a random target
    return pickRandom(targetIds);
  }

  // Absolute fallback to satisfy return type
  return pickRandom(targetIds);
}
