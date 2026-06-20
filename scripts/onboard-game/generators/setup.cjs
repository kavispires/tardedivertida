/**
 * Generator for setup.ts file
 */

const { convertToPascalCase, phaseToPascalCase, phaseToCamelCase } = require('../utils.cjs');

/**
 * Generates the contents of setup.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateSetup(metadata) {
  const { gameKey, phases, rounds } = metadata;
  const pascalName = convertToPascalCase(metadata.gameName);

  const middlePhases = phases.filter((p) => p !== 'SETUP' && p !== 'GAME_OVER');

  const roundsImport = rounds ? `, ${rounds.type === 'fixed' ? 'TOTAL_ROUNDS' : 'MAX_ROUNDS'}` : '';

  const imports = `// Constants
import { ${gameKey}_PHASES${roundsImport} } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { setupAchievements, calculateAchievements } from './achievements';
`;

  // prepareSetupPhase
  const roundsProperty = rounds
    ? `\n        round: {
          current: 0,
          total: ${rounds.type === 'fixed' ? 'TOTAL_ROUNDS' : 'MAX_ROUNDS'},
          forceLastRound: false,
        },`
    : '';

  const prepareSetupPhase = `/**
 * Setup phase - initializes game state and resources
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 * @param data - The game resources data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  return {
    update: {
      store: {
        achievements,
        // TODO: Initialize store properties
      },
      state: {
        phase: ${gameKey}_PHASES.SETUP,${roundsProperty}
      },
    },
  };
};
`;

  // Generate prepare functions for middle phases
  const middlePhaseFunctions = middlePhases
    .map((phase, index) => {
      const pascalPhase = phaseToPascalCase(phase);
      const camelPhase = phaseToCamelCase(phase);
      const isFirst = index === 0;

      const roundIncrement =
        rounds && isFirst
          ? `\n  // Increment round
  const round = utils.game.increaseRound(state.round);
`
          : '';

      const roundProperty = rounds && isFirst ? '\n        round,' : '';

      return `/**
 * ${pascalPhase} phase - TODO: describe phase purpose
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepare${pascalPhase}Phase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
${roundIncrement}
  return {
    update: {
      state: {
        phase: ${gameKey}_PHASES.${phase},
        players,${roundProperty}
        // TODO: Add phase-specific state
      },
      stateCleanup: [/* TODO: List properties to clean up from previous phase */],
    },
  };
};
`;
    })
    .join('\n');

  // prepareGameOverPhase
  const prepareGameOverPhase = `/**
 * Game Over phase - calculates final scores and achievements
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Determine winners
  const winners = utils.players.determineWinners(players);

  // Calculate achievements
  const achievements = calculateAchievements(store.achievements);

  // Mark game meta as complete
  await utils.firestore.markGameAsComplete(gameId);

  // Save game to each user's profile
  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.CONTROLE_DE_ESTOQUE,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  // await saveData(store.language, store.pastStuff);

  // Cleanup player for game over screen
  utils.players.cleanup(players, []); // add in the array any props you want to keep on the player object

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: ${gameKey}_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        achievements,
        winners,
        // TODO: Add game over specific data, like gallery
      },
    },
  };
};
`;

  return `${imports}\n${prepareSetupPhase}\n${middlePhaseFunctions}\n${prepareGameOverPhase}`;
}

module.exports = {
  generateSetup,
};
