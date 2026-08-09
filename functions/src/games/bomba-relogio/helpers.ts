import { sample, shuffle } from 'lodash';
// Types
import type { DataCounts, FirebaseStoreData, Status, TimeBombCard } from './types';
// Constants
import { BOMBA_RELOGIO_PHASES, CARD_TYPES, OUTCOME, ROLES } from './constants';
// Mechanics
import { getListOfPlayers } from '../../mechanics/players';
import { nextPhaseDelegator } from '../../mechanics/session';
// Utils
import { makeArray } from '../../utils';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and game state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param status - The current game status
 */
export const determineNextPhase = (currentPhase: string, round: Round, status: Status): string => {
  const { SETUP, DECLARATION, EXAMINATION, GAME_OVER } = BOMBA_RELOGIO_PHASES;
  const order = [SETUP, DECLARATION, EXAMINATION, GAME_OVER];

  if (currentPhase === EXAMINATION) {
    if (status.outcome === OUTCOME.END) {
      if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
        return GAME_OVER;
      }
      return DECLARATION;
    }

    return EXAMINATION;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Generates the initial game status for the Bomba Relógio game.
 *
 * @param players - The collection of players participating in the game
 * @returns The initial status object containing:
 *   - `cut`: An empty object to track cut wires or actions
 *   - `revealed`: Counter initialized to 0 for revealed items
 *   - `outcome`: Set to `OUTCOME.START` indicating game start state
 *   - `updatedAt`: Current timestamp in milliseconds
 *   - `activePlayerIds`: Object mapping round 0 to a randomly selected player ID, or null if no players exist
 */
export const getStartingStatus = (players: Players): Status => {
  const activePlayerId = sample(getListOfPlayers(players))?.id;

  return {
    cut: {},
    revealed: 0,
    outcome: OUTCOME.START,
    updatedAt: Date.now(),
    activePlayerIds: { 0: activePlayerId ?? null },
  };
};

/**
 * Returns an object containing the initial values for all achievement counters in the Bomba-Relógio game.
 * All achievement types are initialized to 0.
 *
 * @returns An object with the following achievement properties:
 *   - `terrorist`: Counter for terrorist-related achievements
 *   - `terroristBomb`: Counter for terrorist bomb achievements
 *   - `agentBomb`: Counter for agent bomb achievements
 *   - `wires`: Counter for wire-related achievements
 *   - `blank`: Counter for blank achievements
 *   - `picked`: Counter for picked achievements
 */

/**
 * Builds and shuffles a deck of Time Bomb cards containing bombs, wires, and blank cards.
 *
 * @param dataCounts - An object containing the counts for each card type
 * @param dataCounts.bomb - The number of bomb cards to include in the deck
 * @param dataCounts.wires - The number of wire cards to include in the deck
 * @param dataCounts.blank - The number of blank cards to include in the deck
 * @returns A shuffled array of TimeBombCard objects with unique IDs and assigned types
 *
 * @remarks
 * - The bomb card always has ID 'card-0'
 * - Wire cards are assigned sequential IDs starting after the bomb card
 * - Blank cards are assigned sequential IDs starting after the wire cards
 * - The resulting deck is shuffled before being returned
 */
export const buildDeck = (dataCounts: DataCounts): TimeBombCard[] => {
  return shuffle([
    ...makeArray(dataCounts.bomb).map(() => ({
      id: 'card-0',
      type: CARD_TYPES.BOMB,
    })),
    ...makeArray(dataCounts.wires).map((v) => ({
      id: `card-${v + dataCounts.bomb}`,
      type: CARD_TYPES.WIRE,
    })),
    ...makeArray(dataCounts.blank).map((v) => ({
      id: `card-${v + dataCounts.bomb + dataCounts.wires}`,
      type: CARD_TYPES.BLANK,
    })),
  ]);
};

/**
 * Assigns roles (Agent or Terrorist) to players in the game.
 *
 * This function shuffles and distributes roles based on the provided data counts,
 * then assigns them sequentially to players. When a player is assigned the Terrorist
 * role, their achievement counter for 'terrorist' is incremented by 1.
 *
 * @param players - The collection of players in the game
 * @param dataCounts - Object containing the number of agents and terrorists to assign
 * @param storeUpdate - Partial Firebase store data object used for updating achievements
 * @returns void - Modifies the players object in place
 */
export const determineRoles = (
  players: Players,
  dataCounts: DataCounts,
  storeUpdate: Partial<FirebaseStoreData>,
): void => {
  const listOfPlayers = getListOfPlayers(players);
  const allRoles = shuffle([
    ...makeArray(dataCounts.agents).map(() => ROLES.AGENT),
    ...makeArray(dataCounts.terrorists).map(() => ROLES.TERRORIST),
  ]);

  // Assign roles to players
  listOfPlayers.forEach((player, index) => {
    player.role = allRoles[index];
    if (allRoles[index] === ROLES.TERRORIST) {
      increaseAchievement(storeUpdate.achievements, player.id, 'terrorist', 1);
    }
  });
};
