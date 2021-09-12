import { Players } from '../../utils/interfaces';
import { SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
import { Table } from './interfaces';
// Helpers
import * as gameUtils from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  isGameOver?: boolean
): string => {
  const { RULES, SETUP, TELL_DREAM, MATCH, RESOLUTION, LAST_CHANCE, GAME_OVER } = SONHOS_PESADELOS_PHASES;
  const order = [RULES, SETUP, TELL_DREAM, MATCH, RESOLUTION];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === RESOLUTION) {
    return currentRound >= TOTAL_ROUNDS ? LAST_CHANCE : TELL_DREAM;
  }

  if (currentPhase === LAST_CHANCE) {
    return GAME_OVER;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return TELL_DREAM;
};

export const buildTable = (images: string[]): Table => {
  return images.map((cardId) => ({
    cardId,
    dreamer: null,
    nightmares: [],
  }));
};

// export const getTableIndexes = (table: Table, property: string) => {

// }

/**
 * Determine dreams for each player and dreamer for each card
 * @param players
 * @param table
 * @param dreamsCount
 */
export const determineDreams = (players: Players, table: Table, dreamsCount: number) => {
  const shuffledTableIndexes = gameUtils.shuffle(
    Array(table.length)
      .fill(0)
      .map((e, i) => e + i)
  );
  let currentIndex = 0;

  Object.values(players).forEach((player) => {
    for (let d = 0; d < dreamsCount; d++) {
      if (!player.dreams) {
        player.dreams = [];
      }
      player.dreams.push(table[shuffledTableIndexes[currentIndex]].cardId);
      table[shuffledTableIndexes[currentIndex]].dreamer = player.id;

      currentIndex++;
    }
  });
};

/**
 * Determine nightmares for each player and players for each card nightmares
 * @param players
 * @param table
 * @param nightmareCount
 */
export const determineNightmares = (players: Players, table: Table, nightmareCount: number) => {
  const cardIndexDict = table.reduce((acc, entry, index) => {
    acc[entry.cardId] = index;
    return acc;
  }, {});

  const cardIds = Object.keys(cardIndexDict);

  Object.values(players).forEach((player) => {
    const filteredNightmares = gameUtils.shuffle(cardIds.filter((cardId) => !player.dreams.includes(cardId)));

    for (let n = 0; n < nightmareCount; n++) {
      if (!player.nightmares) {
        player.nightmares = [];
      }
      const cardId = filteredNightmares[n];
      player.nightmares.push(cardId);
      table[cardIndexDict[cardId]].nightmares.push(player.id);
    }
  });
};
