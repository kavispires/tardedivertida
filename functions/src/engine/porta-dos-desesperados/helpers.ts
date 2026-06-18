// Constants
import {
  DOOR_LEVELS,
  DOOR_OPTIONS_PER_ROUND,
  OUTCOME,
  PAGES_PER_ROUND,
  PORTA_DOS_DESESPERADOS_PHASES,
  TRAPS,
  TRAPS_ENTRIES,
  WIN_CONDITION,
} from './constants';
// Utils
import utils from '../../utils';
import type { Trap } from './types';
import { sample, sampleSize, shuffle } from 'lodash';

/**
 * Determines the next phase based on the current phase and game state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param isGameOver - Whether the game is over
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { SETUP, BOOK_POSSESSION, DOOR_CHOICE, RESOLUTION, GAME_OVER } = PORTA_DOS_DESESPERADOS_PHASES;
  const order = [SETUP, BOOK_POSSESSION, DOOR_CHOICE, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total) || isGameOver
      ? GAME_OVER
      : BOOK_POSSESSION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
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
 * Randomly choose order of traps, always starting with NONE and ensuring no consecutive traps of the same level
 */
export const createTrapOrder = (): string[] => {
  const trapKeys = Object.keys(TRAPS);

  // The first trap should always be NONE, then shuffle the rest, but the level of the next trap should never be equal to the previous one
  const shuffledTraps = shuffle(trapKeys);
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

/**
 * Calculates dungeon difficulty based on trap levels
 * @param trapsKeys - The array of trap keys in order
 */
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

/**
 * Gets a set of doors from the deck and selects an answer door
 * @param doorDeck - The array of door card IDs
 * @param doorDeckIndex - The current index in the door deck
 * @param trap - The current trap affecting the game
 */
export const getDoorSet = (doorDeck: UID[], doorDeckIndex: number, trap: Trap) => {
  const quantity = trap === TRAPS.EXTRA_DOOR ? DOOR_OPTIONS_PER_ROUND + 1 : DOOR_OPTIONS_PER_ROUND;

  const selectedDoors = doorDeck.slice(doorDeckIndex, doorDeckIndex + quantity);
  const answerDoorId = sample(selectedDoors);

  return {
    doors: selectedDoors,
    answerDoorId,
    newDoorIndex: doorDeckIndex + quantity,
  };
};

/**
 * Gets book pages from the deck based on current trap
 * @param pagesDeck - The array of page card IDs
 * @param pagesDeckIndex - The current index in the pages deck
 * @param trap - The current trap affecting the game
 */
export const getBookPages = (pagesDeck: UID[], pagesDeckIndex: number, trap: Trap) => {
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
export const botDoorSelection = (players: Players, doors: UID[], doorAnswerId: UID) => {
  // The bot pool is only half of the doors, but always has the answer
  const options = [...sampleSize(doors, 4), doorAnswerId];

  utils.players.getListOfBots(players).forEach((bot) => {
    bot.doorId = sample(options);
    bot.ready = true;
  });
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
  visitedDoors: UID[],
  bookPages: UID[],
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
