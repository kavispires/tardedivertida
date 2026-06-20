/**
 * Generator for actions.ts file
 */

const {
  actionToHandlerName,
  actionToPropName,
  actionToDescription,
  actionToActionText,
} = require('../utils.cjs');

/**
 * Generates the contents of actions.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateActions(metadata) {
  const { actions } = metadata;

  const imports = `// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
`;

  const handlers = actions
    .map((action) => {
      const handlerName = actionToHandlerName(action);
      const propName = actionToPropName(action);
      const description = actionToDescription(action);
      const actionText = actionToActionText(action);

      return `/**
 * Handles player ${description}
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting ${actionText}
 * @param ${propName} - The ${actionText} data
 */
export const ${handlerName} = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  ${propName}: unknown,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your ${actionText}',
    shouldReady: true,
    change: { ${propName} },
    nextPhaseFunction: getNextPhase,
  });
};`;
    })
    .join('\n\n');

  return `${imports}\n${handlers}\n`;
}

module.exports = {
  generateActions,
};
