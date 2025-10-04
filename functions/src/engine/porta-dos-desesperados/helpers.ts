// Constants
import {
  DOOR_LEVELS,
  DOOR_OPTIONS_PER_ROUND,
  OUTCOME,
  PAGES_PER_ROUND,
  PORTA_DOS_DESESPERADOS_ACHIEVEMENTS,
  PORTA_DOS_DESESPERADOS_PHASES,
  TRAPS,
  TRAPS_ENTRIES,
  WIN_CONDITION,
} from './constants';
// Utils
import utils from '../../utils';
import type { FirebaseStoreData, PortaDosDesesperadosAchievement, Trap } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { LOBBY, SETUP, BOOK_POSSESSION, DOOR_CHOICE, RESOLUTION, GAME_OVER } = PORTA_DOS_DESESPERADOS_PHASES;
  const order = [LOBBY, SETUP, BOOK_POSSESSION, DOOR_CHOICE, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total) || isGameOver
      ? GAME_OVER
      : BOOK_POSSESSION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return BOOK_POSSESSION;
};

/**
 * Determine if game should game over
 * @param currentPhase - current phase of the game
 * @param round - current round information
 * @param outcome - result of the current round
 * @param winCondition - result of the game (have they won?)
 * @param currentCorridor - current door level
 * @param magic - current magic crystals
 * @returns - true if game should end, false otherwise
 */
export const determineGameOver = (
  currentPhase: string,
  round: Round,
  outcome: string,
  winCondition: string,
  currentCorridor: number,
  magic: number,
): boolean => {
  // Any other phase makes the game continues
  if (currentPhase !== PORTA_DOS_DESESPERADOS_PHASES.RESOLUTION) return false;

  // If the full 15 rounds have been reached
  if (round.total === round.current) return true;

  // If there are less magic crystals than there are doors to go
  if (magic < DOOR_LEVELS - (currentCorridor ?? 0)) return true;

  // If it's the last door and players were successful
  if (currentCorridor === DOOR_LEVELS && outcome === OUTCOME.SUCCESS) return true;

  // If the win condition is anything other than continue
  if (winCondition !== WIN_CONDITION.CONTINUE) return true;

  return false;
};

/**
 * Randomly choose order of traps, always starting with NONE
 * @returns
 */
export const createTrapOrder = (): string[] => {
  const trapKeys = Object.keys(TRAPS);

  // The first trap should always be NONE, then shuffle the rest, but the level of the next trap should never be equal to the previous one
  const shuffledTraps = utils.game.shuffle(trapKeys);
  const orderedTraps = ['NONE'];
  for (let i = 0; i < shuffledTraps.length; i++) {
    const currentTrap = shuffledTraps[i];
    const previousTrap = orderedTraps[orderedTraps.length - 1];

    // If the current trap has the same level as the previous one, reshuffle
    if (TRAPS_ENTRIES?.[currentTrap]?.level === TRAPS_ENTRIES?.[previousTrap]?.level) {
      shuffledTraps.splice(i, 1);
      i--;
      continue;
    }

    orderedTraps.push(currentTrap);
  }

  return orderedTraps.slice(0, DOOR_LEVELS + 1); // There are 7 doors, so we need 6 traps + NONE
};

export const calculateDifficulty = (trapsKeys: string[]) => {
  // There a 7 traps from levels 1 to 3, and the same level cannot be repeated twice in a row.
  // Calculate the difficulty of the dungeon from 1 - 5 based on the traps levels in the game, the minimum sum is 9 (since the first is NONE) and the maximum is 15.
  const levels = trapsKeys.map((key) => TRAPS_ENTRIES?.[key]?.level ?? 0);
  const total = levels.reduce((acc, level) => acc + level, 0);

  // 9
  if (total === 9) return 1;
  // 10, 11
  if (total < 12) return 2;
  // 12
  if (total < 13) return 3;
  // 13, 14
  if (total < 15) return 4;
  // 15
  return 5;
};

export const getDoorSet = (doorDeck: ImageCardId[], doorDeckIndex: number, trap: Trap) => {
  const quantity = trap === TRAPS.EXTRA_DOOR ? DOOR_OPTIONS_PER_ROUND + 1 : DOOR_OPTIONS_PER_ROUND;

  const selectedDoors = doorDeck.slice(doorDeckIndex, doorDeckIndex + quantity);
  const answerDoorId = utils.game.getRandomItem(selectedDoors);

  return {
    doors: selectedDoors,
    answerDoorId,
    newDoorIndex: doorDeckIndex + quantity,
  };
};

export const getBookPages = (pagesDeck: ImageCardId[], pagesDeckIndex: number, trap: Trap) => {
  let quantity = trap === TRAPS.FEWER_PAGES ? PAGES_PER_ROUND / 2 : PAGES_PER_ROUND;

  if (trap === TRAPS.FLIP_BOOK) {
    quantity = 10; // Flip Book trap gives 10 pages
  }

  const selectedPages = pagesDeck.slice(pagesDeckIndex, pagesDeckIndex + quantity);

  return {
    pages: selectedPages,
    newPageIndex: pagesDeckIndex + quantity,
  };
};

/**
 * Assigns random door selections to bot players, ensuring they choose from a limited pool of options.
 *
 * This function gives bots a biased selection of doors that includes the correct door, creating
 * more challenging gameplay by making bots more likely to select the correct answer.
 *
 * @param players - Object containing all player data
 * @param doors - Array of available door IDs that can be selected
 * @param doorAnswerId - The ID of the correct door (answer)
 *
 * @remarks
 * - Bots are limited to choosing from a subset of doors (4 random doors + the answer)
 * - Each bot is marked as ready after door selection
 * - This creates a more competitive experience as bots have a higher chance of selecting the correct door
 */
export const botDoorSelection = (players: Players, doors: ImageCardId[], doorAnswerId: ImageCardId) => {
  // The bot pool is only half of the doors, but always has the answer
  const options = [...utils.game.getRandomItems(doors, 4), doorAnswerId];

  utils.players.getListOfBots(players).forEach((bot) => {
    bot.doorId = utils.game.getRandomItem(options);
    bot.ready = true;
  });
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<PortaDosDesesperadosAchievement>[] = [];

  // Possession
  const { most: mostPossessed, least: leastPossessed } = utils.achievements.getMostAndLeastOf(
    store,
    'possessions',
  );
  if (mostPossessed) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_POSSESSED,
      playerId: mostPossessed.playerId,
      value: mostPossessed.value,
    });
  }
  if (leastPossessed) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.LEAST_POSSESSED,
      playerId: leastPossessed.playerId,
      value: leastPossessed.value,
    });
  }

  // Possession Wins
  const { most: possessionWins } = utils.achievements.getMostAndLeastOf(store, 'possessionWins');
  if (possessionWins) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.BEST_GUIDE,
      playerId: possessionWins.playerId,
      value: possessionWins.value,
    });
  }

  // Possession Wins
  const { most: possessionLosses } = utils.achievements.getMostAndLeastOf(store, 'possessionLosses');
  if (possessionLosses) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.BEGINNER_GUIDE,
      playerId: possessionLosses.playerId,
      value: possessionLosses.value,
    });
  }

  // Possession Duration
  const { most: longestPossession, least: shortestPossession } = utils.achievements.getMostAndLeastOf(
    store,
    'possessionDuration',
  );
  if (longestPossession) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.SLOW_READER,
      playerId: longestPossession.playerId,
      value: Math.round(longestPossession.value / 1000),
    });
  }
  if (shortestPossession) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.FAST_LEARNER,
      playerId: shortestPossession.playerId,
      value: Math.round(shortestPossession.value / 1000),
    });
  }

  // Page Use
  const { most: mostPages, least: fewestPages } = utils.achievements.getMostAndLeastOf(store, 'pages');
  if (mostPages) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_PAGES,
      playerId: mostPages.playerId,
      value: mostPages.value,
    });
  }
  if (fewestPages) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.FEWEST_PAGES,
      playerId: fewestPages.playerId,
      value: fewestPages.value,
    });
  }

  // Correct Doors
  const { most: correctDoors } = utils.achievements.getMostAndLeastOf(store, 'correctDoors');
  if (correctDoors) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_CORRECT_DOORS,
      playerId: correctDoors.playerId,
      value: correctDoors.value,
    });
  }

  // Wrong Doors
  const { most: wrongDoors } = utils.achievements.getMostAndLeastOf(store, 'wrongDoors');
  if (wrongDoors) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_WRONG_DOORS,
      playerId: wrongDoors.playerId,
      value: wrongDoors.value,
    });
  }

  // Solo Correct Doors
  const { most: soloCorrectDoors } = utils.achievements.getMostAndLeastOf(store, 'soloCorrectDoors');
  if (soloCorrectDoors) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_SOLO_CORRECT_DOORS,
      playerId: soloCorrectDoors.playerId,
      value: soloCorrectDoors.value,
    });
  }

  // Solo Wrong Doors
  const { most: soloWrongDoors } = utils.achievements.getMostAndLeastOf(store, 'soloWrongDoors');
  if (soloWrongDoors) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_SOLO_WRONG_DOORS,
      playerId: soloWrongDoors.playerId,
      value: soloWrongDoors.value,
    });
  }

  // Door Duration
  const { most: longestDecision, least: shortestDecision } = utils.achievements.getMostAndLeastOf(
    store,
    'doorDuration',
  );
  if (longestDecision) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.SLOW_DECISIONS,
      playerId: longestDecision.playerId,
      value: Math.round(longestDecision.value / 1000),
    });
  }
  if (shortestDecision) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.QUICK_DECISIONS,
      playerId: shortestDecision.playerId,
      value: Math.round(shortestDecision.value / 1000),
    });
  }

  // Use of magic
  const { most: mostMagic, least: fewestMagic } = utils.achievements.getMostAndLeastOf(store, 'magic');
  if (mostMagic) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MAGIC_WASTER,
      playerId: mostMagic.playerId,
      value: (Math.round(mostMagic.value * 100) / 100).toFixed(2),
    });
  }
  if (fewestMagic) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MAGIC_SAVER,
      playerId: fewestMagic.playerId,
      value: (Math.round(fewestMagic.value * 100) / 100).toFixed(2),
    });
  }

  return achievements;
};

/**
 * Merges visited doors relationships with book pages.
 *
 * @param relationships - The existing relationships between image cards
 * @param visitedDoors - Array of door image card IDs that have been visited
 * @param bookPages - Array of book page image card IDs
 * @returns The updated relationships object with new connections between book pages and visited doors
 *
 * This function associates each book page with all visited doors by adding the door IDs
 * to each page's relationship array. If a book page doesn't have an entry in the relationships
 * object yet, it creates an empty array first.
 */
export function mergeVisitedDoorsRelationships(
  relationships: ImageCardRelationship,
  visitedDoors: ImageCardId[],
  bookPages: ImageCardId[],
) {
  bookPages.forEach((pageId) => {
    if (relationships[pageId] === undefined) {
      relationships[pageId] = [];
    }
    visitedDoors.forEach((doorId) => {
      relationships[pageId].push(doorId);
    });
  });
  return relationships;
}
