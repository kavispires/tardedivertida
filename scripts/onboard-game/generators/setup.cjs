/**
 * Generator for setup.ts file
 */

const { phaseToPascalCase } = require('../utils.cjs');

/**
 * Generates the contents of setup.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateSetup(metadata) {
  const { gameKey, phases, rounds } = metadata;
  const middlePhases = phases.filter((p) => p !== 'SETUP' && p !== 'GAME_OVER');

  const roundsImport = rounds ? `, ${rounds.type === 'fixed' ? 'TOTAL_ROUNDS' : 'MAX_ROUNDS'}` : '';

  const imports = `// Constants
import { ${gameKey}_PHASES${roundsImport} } from './constants';
import { GAME_NAMES } from '../../constants/games';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import { getListOfPlayersIds, setPlayersReadyState, cleanupPlayers } from '../../mechanics/players';
import { determineWinners } from '../../mechanics/scoring';
${rounds ? "import { increaseRound } from '../../mechanics/round';\n" : ''}// Internal
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
 * @param _store - Unused server-side game data
 * @param _state - Unused current game state
 * @param players - The players object
 * @param _resourceData - The game resources data
 * @returns Store and state updates that initialize the session.
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  _resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = setupAchievements(getListOfPlayersIds(players));

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
      const isFirst = index === 0;

      const roundIncrement =
        rounds && isFirst
          ? `\n  // Increment round
  const round = increaseRound(state.round);
`
          : '';

      const roundProperty = rounds && isFirst ? '\n        round,' : '';

      return `/**
 * Prepares the ${phase.toLowerCase().replace(/_/g, ' ')} phase and resets player readiness.
 * @param _store - Unused server-side game data
 * @param ${rounds && isFirst ? 'state' : '_state'} - The current game state
 * @param players - The players object
 * @returns Updates for entering the ${phase.toLowerCase().replace(/_/g, ' ')} phase.
 */
export const prepare${pascalPhase}Phase = async (
  _store: FirebaseStoreData,
  ${rounds && isFirst ? 'state' : '_state'}: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, false);
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
 * @returns The final state and store cleanup for the completed session.
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Determine winners
  const winners = determineWinners(players);

  // Calculate achievements
  const achievements = calculateAchievements(store.achievements);

  // Mark game meta as complete
  await markGameAsComplete(gameId);

  // Save game to each user's profile
  await saveGameToUsers({
    gameName: GAME_NAMES.${gameKey},
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
  cleanupPlayers(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
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
