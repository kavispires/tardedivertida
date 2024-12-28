import type { DeckEntry, Summary } from './types';
import utils from '../../utils';
// Constants
import { COMUNICACAO_DUO_PHASES, AFFILIATIONS, DECK, DECK_ENTRY_STATUS } from './constants';
import type { Item } from '../../types/tdr';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  nextPhase?: keyof typeof COMUNICACAO_DUO_PHASES,
): string => {
  const { RULES, SETUP, ASKING_FOR_SOMETHING, DELIVER_SOMETHING, VERIFICATION, GAME_OVER } =
    COMUNICACAO_DUO_PHASES;
  const order = [RULES, SETUP, ASKING_FOR_SOMETHING, DELIVER_SOMETHING, VERIFICATION, GAME_OVER];

  if (currentPhase === VERIFICATION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : nextPhase || ASKING_FOR_SOMETHING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return ASKING_FOR_SOMETHING;
};

export const applyDataToDeck = (list: any[], type: string): DeckEntry[] => {
  return utils.game.shuffle(DECK).map((entry, index) => {
    if (type === 'images') {
      return {
        ...entry,
        data: {
          id: list[index],
          type: 'image',
        },
      };
    }

    if (type === 'items') {
      const dataEntry: Item = list[index];
      return {
        ...entry,
        data: {
          id: dataEntry.id,
          name: dataEntry.name,
          type: 'item',
        },
      };
    }

    // TODO: Add support to suspects, contenders, and other types

    return {
      ...entry,
      data: list[index],
    };
  });
};

export const countDeliverablesLeft = (deck: DeckEntry[]): Summary => {
  let deliverablesLeftForA = 0;
  let deliverablesLeftForB = 0;
  let deliverablesLeft = 0;

  deck.forEach((entry: DeckEntry) => {
    if (![DECK_ENTRY_STATUS.A, DECK_ENTRY_STATUS.B].includes(entry.status)) {
      if (entry.affiliation.includes(AFFILIATIONS.A) || entry.affiliation.includes(AFFILIATIONS.B)) {
        deliverablesLeft += 1;
      }

      if (entry.affiliation.includes(AFFILIATIONS.A)) {
        deliverablesLeftForA += 1;
      }
      if (entry.affiliation.includes(AFFILIATIONS.B)) {
        deliverablesLeftForB += 1;
      }
    }
  });

  return {
    deliverablesLeft,
    deliverablesLeftForA,
    deliverablesLeftForB,
  };
};
