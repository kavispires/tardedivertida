// Constants
import { BOMBA_RELOGIO_ACHIEVEMENTS, BOMBA_RELOGIO_PHASES, CARD_TYPES, OUTCOME, ROLES } from './constants';
// Utils
import utils from '../../utils';
import type { BombaRelogioAchievement, DataCounts, FirebaseStoreData, Status, TimeBombCard } from './types';
import { sample, shuffle } from 'lodash';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, status: Status): string => {
  const { LOBBY, SETUP, DECLARATION, EXAMINATION, GAME_OVER } = BOMBA_RELOGIO_PHASES;
  const order = [LOBBY, SETUP, DECLARATION, EXAMINATION, GAME_OVER];

  if (currentPhase === EXAMINATION) {
    if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
      return GAME_OVER;
    }

    return status.outcome === OUTCOME.END ? DECLARATION : EXAMINATION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return EXAMINATION;
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
  const activePlayerId = sample(utils.players.getListOfPlayers(players))?.id;

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
export const getStartingAchievements = () => {
  return {
    terrorist: 0,
    terroristBomb: 0,
    agentBomb: 0,
    wires: 0,
    blank: 0,
    picked: 0,
  };
};

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
    ...utils.game.makeArray(dataCounts.bomb).map(() => ({
      id: 'card-0',
      type: CARD_TYPES.BOMB,
    })),
    ...utils.game.makeArray(dataCounts.wires).map((v) => ({
      id: `card-${v + dataCounts.bomb}`,
      type: CARD_TYPES.WIRE,
    })),
    ...utils.game.makeArray(dataCounts.blank).map((v) => ({
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
  const listOfPlayers = utils.players.getListOfPlayers(players);
  const allRoles = shuffle([
    ...utils.game.makeArray(dataCounts.agents).map(() => ROLES.AGENT),
    ...utils.game.makeArray(dataCounts.terrorists).map(() => ROLES.TERRORIST),
  ]);

  // Assign roles to players
  listOfPlayers.forEach((player, index) => {
    player.role = allRoles[index];
    if (allRoles[index] === ROLES.TERRORIST) {
      utils.achievements.increase(storeUpdate, player.id, 'terrorist', 1);
    }
  });
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<BombaRelogioAchievement>[] = [];

  // Solo Terrorist
  const { most: soloTerrorist } = utils.achievements.getMostAndLeastOf(store, 'terrorist');
  if (soloTerrorist) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.SOLO_TERRORIST,
      playerId: soloTerrorist.playerId,
      value: soloTerrorist.value,
    });
  }

  // Terrorist exploded the bomb
  const { most: terroristBomber } = utils.achievements.getMostAndLeastOf(store, 'terroristBomb');
  if (terroristBomber) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.BEST_TERRORIST,
      playerId: terroristBomber.playerId,
      value: terroristBomber.value,
    });
  }

  // Agent exploded the bomb
  const { most: acidentalBomber } = utils.achievements.getMostAndLeastOf(store, 'agentBomb');
  if (acidentalBomber) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.ACCIDENTAL_BOMBER,
      playerId: acidentalBomber.playerId,
      value: acidentalBomber.value,
    });
  }

  // Most Picked
  const { most: trusted, least: leastTrusted } = utils.achievements.getMostAndLeastOf(store, 'picked');
  if (trusted) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.MOST_TRUSTED,
      playerId: trusted.playerId,
      value: trusted.value,
    });
  }
  if (leastTrusted) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.LEAST_TRUSTED,
      playerId: leastTrusted.playerId,
      value: leastTrusted.value,
    });
  }

  // Most and fewest red wires
  const { most: mostWires, least: leastWires } = utils.achievements.getMostAndLeastOf(store, 'wires');
  if (mostWires) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.MOST_WIRES,
      playerId: mostWires.playerId,
      value: mostWires.value,
    });
  }
  if (leastWires) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.FEWEST_WIRES,
      playerId: leastWires.playerId,
      value: leastWires.value,
    });
  }

  // Most and fewest blank cards
  const { most: mostBlanks, least: leastBlanks } = utils.achievements.getMostAndLeastOf(store, 'blank');
  if (mostBlanks) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.MOST_BLANKS,
      playerId: mostBlanks.playerId,
      value: mostBlanks.value,
    });
  }
  if (leastBlanks) {
    achievements.push({
      type: BOMBA_RELOGIO_ACHIEVEMENTS.FEWEST_BLANKS,
      playerId: leastBlanks.playerId,
      value: leastBlanks.value,
    });
  }

  return achievements;
};
