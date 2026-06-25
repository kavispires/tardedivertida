import { shuffle } from 'lodash';
// Types
import type { ContenderCardData, ItemData, SuspectCardData, TextCardData } from '../../types/tdr';
import type { DeckEntry, Summary } from './types';
// Constants
import { COMUNICACAO_DUO_PHASES, AFFILIATIONS, DECK, DECK_ENTRY_STATUS } from './constants';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param nextPhase - Optional specific next phase to use
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  nextPhase?: keyof typeof COMUNICACAO_DUO_PHASES,
): string => {
  const { SETUP, ASKING_FOR_SOMETHING, DELIVER_SOMETHING, VERIFICATION, GAME_OVER } = COMUNICACAO_DUO_PHASES;
  const order = [SETUP, ASKING_FOR_SOMETHING, DELIVER_SOMETHING, VERIFICATION, GAME_OVER];

  if (currentPhase === VERIFICATION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : nextPhase || ASKING_FOR_SOMETHING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Applies data from the list to the deck entries based on the type
 * @param list - The list of data to apply to the deck
 * @param type - The type of data being applied (images, items, words, contenders, suspects)
 */
export const applyDataToDeck = (list: unknown[], type: string): DeckEntry[] => {
  return shuffle(DECK).map((entry, index) => {
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
      const dataEntry = list[index] as ItemData;
      return {
        ...entry,
        data: {
          id: dataEntry.id,
          name: dataEntry.name,
          type: 'item',
        },
      };
    }

    if (type === 'words') {
      const dataEntry = list[index] as TextCardData;
      return {
        ...entry,
        data: {
          id: dataEntry.id,
          type: 'word',
          text: dataEntry.text,
        },
      };
    }

    if (type === 'contenders') {
      const dataEntry = list[index] as ContenderCardData;
      return {
        ...entry,
        data: {
          id: dataEntry.id,
          type: 'contender',
          name: dataEntry.name,
        },
      };
    }

    if (type === 'suspects') {
      const dataEntry = list[index] as SuspectCardData;
      return {
        ...entry,
        data: {
          id: dataEntry.id,
          type: 'suspect',
          name: dataEntry.name,
        },
      };
    }

    return {
      ...entry,
      data: list[index],
    };
  });
};

/**
 * Counts the number of deliverable items remaining in the deck for each player
 * @param deck - The array of deck entries
 */
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
