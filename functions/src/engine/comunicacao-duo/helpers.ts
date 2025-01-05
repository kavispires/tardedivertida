import type { ComunicacaoDuoAchievement, DeckEntry, FirebaseStoreData, Summary } from './types';
import utils from '../../utils';
// Constants
import {
  COMUNICACAO_DUO_PHASES,
  AFFILIATIONS,
  DECK,
  DECK_ENTRY_STATUS,
  COMUNICACAO_DUO_ACHIEVEMENTS,
} from './constants';
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
  utils.helpers.warnMissingPhase(currentPhase);
  return ASKING_FOR_SOMETHING;
};

export const applyDataToDeck = (list: unknown[], type: string): DeckEntry[] => {
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
      const dataEntry = list[index] as Item;
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

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<ComunicacaoDuoAchievement>[] = [];

  // Delivered taboo
  const result = utils.achievements.getOnlyExactMatch(store, 'tabooDeliveries', 1);
  if (result) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.DELIVERED_TABOO,
      playerId: result.playerId,
      value: result.value,
    });
  }

  // Most and fewest requested at once
  const { most: mostRequested, least: fewestRequested } = utils.achievements.getHighestAndLowestOccurrences(
    store,
    'clueQuantity',
  );
  if (mostRequested) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.MOST_REQUESTED_AT_ONCE,
      playerId: mostRequested.playerId,
      value: mostRequested.value,
    });
  }
  if (fewestRequested) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.FEWEST_REQUESTED_AT_ONCE,
      playerId: fewestRequested.playerId,
      value: fewestRequested.value,
    });
  }

  // Most and fewest delivered items at once
  const { most: mostDelivered, least: fewestDelivered } = utils.achievements.getHighestAndLowestOccurrences(
    store,
    'deliveries',
  );
  if (mostDelivered) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.MOST_DELIVERED_AT_ONCE,
      playerId: mostDelivered.playerId,
      value: mostDelivered.value,
    });
  }
  if (fewestDelivered) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.FEWEST_DELIVERED_AT_ONCE,
      playerId: fewestDelivered.playerId,
      value: fewestDelivered.value,
    });
  }

  // Most and fewest correct deliveries
  const { most: mostDeliveredItems, least: fewestDeliveredItems } = utils.achievements.getMostAndLeastOf(
    store,
    'correctDeliveries',
  );
  if (mostDeliveredItems) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.MOST_DELIVERED_ITEMS,
      playerId: mostDeliveredItems.playerId,
      value: mostDeliveredItems.value,
    });
  }
  if (fewestDeliveredItems) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.FEWEST_DELIVERED_ITEMS,
      playerId: fewestDeliveredItems.playerId,
      value: fewestDeliveredItems.value,
    });
  }

  // Most and fewest neutral deliveries
  const { most: mostNeutral, least: fewestNeutral } = utils.achievements.getMostAndLeastOf(
    store,
    'neutralDeliveries',
  );
  if (mostNeutral) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.MOST_NEUTRAL_DELIVERIES,
      playerId: mostNeutral.playerId,
      value: mostNeutral.value,
    });
  }
  if (fewestNeutral) {
    achievements.push({
      type: COMUNICACAO_DUO_ACHIEVEMENTS.FEWEST_NEUTRAL_DELIVERIES,
      playerId: fewestNeutral.playerId,
      value: fewestNeutral.value,
    });
  }

  return achievements;
};
