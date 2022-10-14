// Types

// Constants
import {
  DOOR_LEVELS,
  DOOR_OPTIONS_PER_ROUND,
  OUTCOME,
  PAGES_PER_ROUND,
  PORTA_DOS_DESESPERADOS_PHASES,
  TRAPS,
  WIN_CONDITION,
} from './constants';
// Utils
import * as utils from '../../utils';
import { Trap } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean,
  isGameOver?: boolean
): string => {
  const { RULES, SETUP, BOOK_POSSESSION, DOOR_CHOICE, RESOLUTION, GAME_OVER } = PORTA_DOS_DESESPERADOS_PHASES;
  const order = [RULES, SETUP, BOOK_POSSESSION, DOOR_CHOICE, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return triggerLastRound || (round.current > 0 && round.current === round.total) || isGameOver
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
  currentCorridor: number
): boolean => {
  if (currentPhase !== PORTA_DOS_DESESPERADOS_PHASES.RESOLUTION) return false;

  if (round.total === round.current) return true;

  if (
    (currentCorridor === DOOR_LEVELS && outcome === OUTCOME.SUCCESS) ||
    winCondition !== WIN_CONDITION.CONTINUE
  )
    return true;

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
