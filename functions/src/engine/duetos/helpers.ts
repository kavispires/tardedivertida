// Constants
import { DUETOS_PHASES } from './constants';
// Utils
// import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, PAIRING, RESULTS, GAME_OVER } = DUETOS_PHASES;
  const order = [RULES, SETUP, PAIRING, RESULTS];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : PAIRING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return PAIRING;
};

export const addAlienItems = (pool: AlienItem[], quantity: number, receiver: any[]) => {
  for (let i = 0; i < quantity; i++) {
    const item = pool.pop();
    if (item) {
      receiver.push({
        type: 'alien-item',
        value: {
          id: item.id,
          name: item.name,
        },
      });
    }
  }
};

export const addSpecial = (pool: any[], quantity: number, receiver: any[], type: string) => {
  for (let i = 0; i < quantity; i++) {
    const element = pool.pop();
    if (element) {
      receiver.push({
        type,
        value: element,
      });
    }
  }
};
