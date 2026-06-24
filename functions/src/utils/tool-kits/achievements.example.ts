import utils from '..';
// Internal
import { achievementBuilder } from './achievements';

/**
 * EXAMPLE: Adedanhx Achievements using the Tool-Kit
 *
 * This demonstrates how to use the achievements tool-kit for a real game.
 * Compare this to the old system in functions/src/engine/adedanhx/
 */

// ========================================
// DEFINITION (replaces constants.ts + setup pattern)
// ========================================

const achievements = achievementBuilder('ADEDANHX')
  // COUNTERS - track numeric values
  .counter('stops', {
    doc: 'Number of times player pressed the stop button',
    most: 'MOST_STOPS',
    // least: null, // Don't create "least stops" achievement
  })
  .counter('first', {
    doc: 'Number of times player was first to answer',
    most: 'MOST_FIRST_ANSWERS',
    least: 'LEAST_FIRST_ANSWERS',
  })
  .counter('cells', {
    doc: 'Total number of cells answered by player',
    most: 'MOST_CELLS',
    least: 'FEWEST_CELLS',
  })
  .counter('autoReject', {
    doc: 'Answers auto-rejected for not matching letter rules',
    most: 'MOST_AUTO_REJECTS',
    // No least needed
  })

  // EXACT MATCH - checks existing property for exact value
  .exactMatch('neverStopped', {
    doc: 'Player never pressed stop button',
    key: 'NEVER_STOPPED',
    value: 0,
    property: 'stops', // Check if 'stops' === 0
  })
  .build();

// ========================================
// EXPORTS (what you export from achievements.ts)
// ========================================

// Destructure and export the utility functions
// Note: Use simple 'achievements' variable name since it's not exported directly
export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;

// ========================================
// USAGE IN GAME
// ========================================

/**
 * 1. SETUP PHASE (setup.ts - prepareSetupPhase)
 */
function exampleSetupPhase(players: Players) {
  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));
  // Returns: {
  //   player1: { stops: 0, first: 0, cells: 0, autoReject: 0 },
  //   player2: { stops: 0, first: 0, cells: 0, autoReject: 0 },
  // }

  return {
    update: {
      store: {
        achievements, // ← Saved to Firebase
      },
    },
  };
}

/**
 * 2. TRACKING PHASE (helpers.ts, actions.ts - during gameplay)
 */
function exampleTracking(store: { achievements: PlainObject }, playerId: UID) {
  // ✅ Type-safe with autocomplete
  increaseAchievement(store.achievements, playerId, 'stops', 1);
  increaseAchievement(store.achievements, playerId, 'first', 1);
  increaseAchievement(store.achievements, playerId, 'cells', 1);

  // ❌ These would cause TypeScript errors:
  // increaseAchievement(store.achievements, playerId, 'typo', 1); // Property doesn't exist
  // pushAchievement(store.achievements, playerId, 'stops', 'value'); // 'stops' is not an array
}

/**
 * 3. CALCULATION PHASE (setup.ts - prepareGameOverPhase)
 */
function exampleCalculation(store: { achievements: PlainObject }): Achievement<string>[] {
  // No exclusions needed for this game (pass undefined)
  const achievementResults = calculateAchievements(store.achievements);
  // Returns: [
  //   { type: 'MOST_STOPS', playerId: 'player1', value: 5 },
  //   { type: 'MOST_FIRST_ANSWERS', playerId: 'player2', value: 10 },
  //   { type: 'NEVER_STOPPED', playerId: 'player3', value: 0 },
  //   { type: 'MOST_CELLS', playerId: 'player1', value: 15 },
  //   { type: 'FEWEST_CELLS', playerId: 'player4', value: 3 },
  //   // ... etc
  // ]

  return achievementResults;
}

// ========================================
// ARRAY EXAMPLE (for reference)
// ========================================

const arrayExample = achievementBuilder('EXAMPLE')
  // General array - use push()
  .array('weapons', {
    doc: 'Weapons selected across all rounds',
    unique: {
      most: 'MOST_WEAPONS',
      least: 'LEAST_WEAPONS',
    },
  })

  // Indexed array - use insert()
  .array('correct', {
    doc: 'Boolean array of correct guesses per round',
    indexed: true,
    occurrence: {
      earliest: 'EARLIEST_CORRECT',
      latest: 'LATEST_CORRECT',
    },
  })

  // Accumulated array - use push() and addToLast()
  .array('roundScores', {
    doc: 'Score accumulated per round',
    accumulated: true,
    average: {
      most: 'BEST_AVERAGE',
    },
  })
  .build();

function exampleArrayUsage(store: { achievements: PlainObject }, playerId: UID) {
  // General array
  arrayExample.pushAchievement(store.achievements, playerId, 'weapons', 'knife');
  arrayExample.pushAchievement(store.achievements, playerId, 'weapons', 'gun');

  // Indexed array
  arrayExample.insertAchievement(store.achievements, playerId, 'correct', true, 0); // Round 0
  arrayExample.insertAchievement(store.achievements, playerId, 'correct', false, 1); // Round 1

  // Accumulated array
  arrayExample.pushAchievement(store.achievements, playerId, 'roundScores', 0); // Start round
  arrayExample.addToLastAchievement(store.achievements, playerId, 'roundScores', 10); // Add to current
  arrayExample.addToLastAchievement(store.achievements, playerId, 'roundScores', 5); // Add more
  // Result: [15]
}

// ========================================
// COMPARISON: OLD VS NEW
// ========================================

/**
 * OLD SYSTEM (3 files, ~115 lines):
 *
 * constants.ts:
 *   export const ADEDANHX_ACHIEVEMENTS = { MOST_STOPS: 'MOST_STOPS', ... }
 *
 * setup.ts:
 *   utils.achievements.setup(players, { stop: 0, first: 0, cells: 0, autoReject: 0 })
 *
 * helpers.ts:
 *   utils.achievements.increase(store, playerId, 'stop', 1)
 *   export const getAchievements = (store) => {
 *     const { most } = getMostAndLeastOf(store, 'stop');
 *     // ... 60 more lines ...
 *   }
 *
 * NEW SYSTEM (1 file, ~52 lines):
 *
 * achievements.ts:
 *   const achievements = achievementBuilder('ADEDANHX')
 *     .counter('stops', { most: 'MOST_STOPS' })
 *     .build();
 *   export const { setup, increase, calculate } = achievements;
 *
 * setup.ts:
 *   setup(players)
 *
 * helpers.ts:
 *   increase(store.achievements, playerId, 'stops', 1)
 *   export const getAchievements = calculate
 */

// ========================================
// EXCLUSIONS EXAMPLE (comunicacao-alienigena pattern)
// ========================================

const exclusionsExample = achievementBuilder('COMUNICACAO')
  .counter('correctGuesses', {
    doc: 'Correct guesses made by humans',
    most: 'MOST_CORRECT',
    requiresExclusions: true, // Alien player should be excluded
  })
  .array('objectsQuestioned', {
    doc: 'Objects questioned by humans',
    unique: { most: 'MOST_QUESTIONED' },
    requiresExclusions: true, // Alien player should be excluded
  })
  .build();

function exampleWithExclusions(
  store: { achievements: PlainObject },
  players: Players,
): Achievement<string>[] {
  // Find special player(s) to exclude
  const alienId = findAlienPlayerId(players);

  // ✅ Pass exclusions for properties that require them
  const results = exclusionsExample.calculateAchievements(store.achievements, {
    correctGuesses: [alienId],
    objectsQuestioned: [alienId],
  });

  // ❌ This would throw an error:
  // const badResults = exclusionsExample.calculate(store.achievements, undefined, players);
  // Error: Missing required exclusions for properties: correctGuesses, objectsQuestioned

  return results;
}

function findAlienPlayerId(players: Players): string {
  return Object.values(players).find((p) => p.role === 'alien')?.id ?? '';
}

// Prevent unused warnings
export { exampleSetupPhase, exampleTracking, exampleCalculation, exampleArrayUsage, exampleWithExclusions };
