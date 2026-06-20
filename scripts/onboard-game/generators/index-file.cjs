/**
 * Generator for index.ts file
 */

const {
  convertToPascalCase,
  actionToHandlerName,
  actionToPropName,
  actionToDescription,
  phaseToPascalCase,
} = require('../utils.cjs');

/**
 * Generates the contents of index.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateIndex(metadata) {
  const { gameName, gameKey, phases, actions, rounds } = metadata;
  const pascalName = convertToPascalCase(gameName);

  // Imports section
  const roundsImport = rounds ? `,\n  ${rounds.type === 'fixed' ? 'TOTAL_ROUNDS' : 'MAX_ROUNDS'}` : '';
  const imports = `// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  ${gameKey}_ACTIONS,
  ${gameKey}_PHASES,
  PLAYER_COUNTS${roundsImport},
} from './constants';
// Types
import type {
  ${pascalName}InitialState,
  ${pascalName}Options,
  ${pascalName}SubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
${phases
  .filter((p) => p !== 'SETUP' && p !== 'GAME_OVER')
  .map((p) => `  prepare${phaseToPascalCase(p)}Phase,`)
  .join('\n')}
  prepareGameOverPhase,
} from './setup';
import { ${actions.map((a) => actionToHandlerName(a)).join(', ')} } from './actions';
import { getData } from './data';
`;

  // getInitialState function
  const roundsProperty = rounds
    ? `\n    'totalRounds': ${rounds.type === 'fixed' ? 'TOTAL_ROUNDS' : 'MAX_ROUNDS'},`
    : '';
  const getInitialState = `/**
 * Gets the initial state for a new game session
 * @param gameId - The game session ID
 * @param uid - The user ID of the game creator
 * @param language - The language code
 * @param version - The game version
 * @param options - Optional game configuration options
 */
export const getInitialState = (
  gameId: UID,
  uid: string,
  language: Language,
  version: string,
  options: ${pascalName}Options,
): ${pascalName}InitialState => {
  return utils.game.getDefaultInitialState<${pascalName}InitialState>({
    gameId,
    gameName: GAME_NAMES.${gameKey},
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,${roundsProperty}
    store: {},
    options,
  });
};
`;

  // getPlayerCounts function
  const getPlayerCounts = `/**
 * Gets the player count requirements for the game
 */
export const getPlayerCounts = () => PLAYER_COUNTS;
`;

  // getNextPhase function - generate phase transition blocks
  const middlePhases = phases.filter((p) => p !== 'SETUP' && p !== 'GAME_OVER');
  const phaseBlocks = middlePhases
    .map((phase, index) => {
      const isFirst = index === 0;
      const previousPhase = isFirst ? 'SETUP' : middlePhases[index - 1];
      const pascalPhase = phaseToPascalCase(phase);

      return `  // ${previousPhase} -> ${phase}
  if (nextPhase === ${gameKey}_PHASES.${phase}) {
    const newPhase = await prepare${pascalPhase}Phase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }
`;
    })
    .join('\n');

  const lastMiddlePhase = middlePhases[middlePhases.length - 1] || 'SETUP';

  const getNextPhase = `/**
 * Handles phase progression and prepares the next game phase
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param currentState - Optional current state for optimization
 */
export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state.phase, state.round);

  // LOBBY -> SETUP
  if (nextPhase === ${gameKey}_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data and prepare setup phase
    const additionalData = await getData(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

${phaseBlocks}
  // ${lastMiddlePhase} -> GAME_OVER
  if (nextPhase === ${gameKey}_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};
`;

  // submitAction function
  const actionCases = actions
    .map((action) => {
      const handlerName = actionToHandlerName(action);
      const propName = actionToPropName(action);
      const description = actionToDescription(action);

      return `    case ${gameKey}_ACTIONS.${action}:
      utils.firebase.validateSubmitActionProperties(data, ['${propName}'], '${description}');
      return ${handlerName}(gameName, gameId, playerId, data.${propName});`;
    })
    .join('\n');

  const submitAction = `/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: ${pascalName}SubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
${actionCases}
    default:
      utils.firebase.throwException(\`Given action \${action} is not allowed\`, action);
  }
};
`;

  return `${imports}\n${getInitialState}\n${getPlayerCounts}\n${getNextPhase}\n${submitAction}`;
}

module.exports = {
  generateIndex,
};
