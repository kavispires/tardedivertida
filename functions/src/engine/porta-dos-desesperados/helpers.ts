// Types

// Constants
import {
  DOOR_LEVELS,
  DOOR_OPTIONS_PER_ROUND,
  OUTCOME,
  PAGES_PER_ROUND,
  PORTA_DOS_DESESPERADOS_ACHIEVEMENTS,
  PORTA_DOS_DESESPERADOS_PHASES,
  TRAPS,
  WIN_CONDITION,
} from './constants';
// Utils
import utils from '../../utils';
import { FirebaseStoreData, PortaDosDesesperadosAchievement, Trap } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { RULES, SETUP, BOOK_POSSESSION, DOOR_CHOICE, RESOLUTION, GAME_OVER } = PORTA_DOS_DESESPERADOS_PHASES;
  const order = [RULES, SETUP, BOOK_POSSESSION, DOOR_CHOICE, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total) || isGameOver
      ? GAME_OVER
      : BOOK_POSSESSION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return BOOK_POSSESSION;
};

/**
 * Determine if game should game over
 * @param currentPhase
 * @param round
 * @param outcome
 * @param winCondition
 * @param currentCorridor
 * @returns
 */
export const determineGameOver = (
  currentPhase: string,
  round: Round,
  outcome: string,
  winCondition: string,
  currentCorridor: number,
  magic: number
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
  return [TRAPS.NONE, ...utils.game.shuffle(trapKeys), ...utils.game.shuffle(trapKeys)].slice(0, DOOR_LEVELS);
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
  const quantity = trap === TRAPS.FEWER_PAGES ? PAGES_PER_ROUND / 2 : PAGES_PER_ROUND;

  const selectedPages = pagesDeck.slice(pagesDeckIndex, pagesDeckIndex + quantity);

  return {
    pages: selectedPages,
    newPageIndex: pagesDeckIndex + quantity,
  };
};

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
    'possessions'
  );
  if (mostPossessed) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_POSSESSED,
      playerId: mostPossessed.playerId,
      value: mostPossessed.possessions,
    });
  }
  if (leastPossessed) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.LEAST_POSSESSED,
      playerId: leastPossessed.playerId,
      value: leastPossessed.possessions,
    });
  }

  // Possession Wins
  const { most: possessionWins } = utils.achievements.getMostAndLeastOf(store, 'possessionWins');
  if (possessionWins) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.BEST_GUIDE,
      playerId: possessionWins.playerId,
      value: possessionWins.possessionWins,
    });
  }

  // Possession Wins
  const { most: possessionLosses } = utils.achievements.getMostAndLeastOf(store, 'possessionLosses');
  if (possessionLosses) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.BEGINNER_GUIDE,
      playerId: possessionLosses.playerId,
      value: possessionLosses.possessionLosses,
    });
  }

  // Possession Duration
  const { most: longestPossession, least: shortestPossession } = utils.achievements.getMostAndLeastOf(
    store,
    'possessionDuration'
  );
  if (longestPossession) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.SLOW_READER,
      playerId: longestPossession.playerId,
      value: Math.round(longestPossession.possessionDuration / 1000),
    });
  }
  if (shortestPossession) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.FAST_LEARNER,
      playerId: shortestPossession.playerId,
      value: Math.round(shortestPossession.possessionDuration / 1000),
    });
  }

  // Page Use
  const { most: mostPages, least: fewestPages } = utils.achievements.getMostAndLeastOf(store, 'pages');
  if (mostPages) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_PAGES,
      playerId: mostPages.playerId,
      value: mostPages.pages,
    });
  }
  if (fewestPages) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.FEWEST_PAGES,
      playerId: fewestPages.playerId,
      value: fewestPages.pages,
    });
  }

  // Correct Doors
  const { most: correctDoors } = utils.achievements.getMostAndLeastOf(store, 'correctDoors');
  if (correctDoors) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_CORRECT_DOORS,
      playerId: correctDoors.playerId,
      value: correctDoors.correctDoors,
    });
  }

  // Wrong Doors
  const { most: wrongDoors } = utils.achievements.getMostAndLeastOf(store, 'wrongDoors');
  if (wrongDoors) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_WRONG_DOORS,
      playerId: wrongDoors.playerId,
      value: wrongDoors.wrongDoors,
    });
  }

  // Solo Correct Doors
  const { most: soloCorrectDoors } = utils.achievements.getMostAndLeastOf(store, 'soloCorrectDoors');
  if (soloCorrectDoors) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_SOLO_CORRECT_DOORS,
      playerId: soloCorrectDoors.playerId,
      value: soloCorrectDoors.soloCorrectDoors,
    });
  }

  // Solo Wrong Doors
  const { most: soloWrongDoors } = utils.achievements.getMostAndLeastOf(store, 'soloWrongDoors');
  if (soloWrongDoors) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MOST_SOLO_WRONG_DOORS,
      playerId: soloWrongDoors.playerId,
      value: soloWrongDoors.soloWrongDoors,
    });
  }

  // Door Duration
  const { most: longestDecision, least: shortestDecision } = utils.achievements.getMostAndLeastOf(
    store,
    'doorDuration'
  );
  if (longestDecision) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.SLOW_DECISIONS,
      playerId: longestDecision.playerId,
      value: Math.round(longestDecision.doorDuration / 1000),
    });
  }
  if (shortestDecision) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.QUICK_DECISIONS,
      playerId: shortestDecision.playerId,
      value: Math.round(shortestDecision.doorDuration / 1000),
    });
  }

  // Use of magic
  const { most: mostMagic, least: fewestMagic } = utils.achievements.getMostAndLeastOf(store, 'magic');
  if (mostMagic) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MAGIC_WASTER,
      playerId: mostMagic.playerId,
      value: (Math.round(mostMagic.magic * 100) / 100).toFixed(2),
    });
  }
  if (fewestMagic) {
    achievements.push({
      type: PORTA_DOS_DESESPERADOS_ACHIEVEMENTS.MAGIC_SAVER,
      playerId: fewestMagic.playerId,
      value: (Math.round(fewestMagic.magic * 100) / 100).toFixed(2),
    });
  }

  return achievements;
};

export function mergeVisitedDoorsRelationships(
  relationships: ImageCardRelationship,
  visitedDoors: ImageCardId[],
  bookPages: ImageCardId[]
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
