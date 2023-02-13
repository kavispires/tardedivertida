// Constants
import { COMUNICACAO_ALIENIGENA_PHASES, ITEMS_COUNT, ITEM_TYPES, TOTAL_ITEMS } from './constants';
// Utils
import utils from '../../utils';
import { ComunicacaoAlienigenaState } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (state: ComunicacaoAlienigenaState): string => {
  const {
    RULES,
    SETUP,
    ALIEN_SELECTION,
    HUMAN_ASK,
    ALIEN_ANSWER,
    ALIEN_REQUEST,
    OFFERINGS,
    REVEAL,
    GAME_OVER,
  } = COMUNICACAO_ALIENIGENA_PHASES;
  const order = [RULES, SETUP, ALIEN_SELECTION, HUMAN_ASK, ALIEN_ANSWER, ALIEN_REQUEST, OFFERINGS, REVEAL];

  const { phase: currentPhase, round, humanId, turnOrder, status } = state;

  if (currentPhase === REVEAL) {
    if (status.timeLeft < 1) {
      return GAME_OVER;
    }

    if (status.needed === status.found) {
      return GAME_OVER;
    }

    return round.forceLastRound ? GAME_OVER : HUMAN_ASK;
  }

  // If the last player answer, go to alien request otherwise the next human
  if (currentPhase === ALIEN_ANSWER && turnOrder) {
    return turnOrder.indexOf(humanId) === turnOrder.length - 1 ? ALIEN_REQUEST : HUMAN_ASK;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return HUMAN_ASK;
};

export const getItems = (playerCount: number) => {
  const counts = ITEMS_COUNT[playerCount];
  const answers = new Array(counts.answers).fill(ITEM_TYPES.ITEM);
  const cursers = new Array(counts.curses).fill(ITEM_TYPES.CURSE);
  const rest = new Array(TOTAL_ITEMS - counts.answers - counts.curses).fill(ITEM_TYPES.BLANK);

  return utils.game.shuffle([...answers, ...cursers, ...rest]);
};
