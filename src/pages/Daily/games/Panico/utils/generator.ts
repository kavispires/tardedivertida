import { random, shuffle } from 'lodash';
// Internal
import { BUTTONS_LIBRARY, POOLS } from './data';

type PlacedButton = {
  key: string;
  poolIndex?: number;
  targetCount: number;
  expectedAction: string;
  level: number;
};

/**
 * Generates a game sequence based on extensive game rules and dependencies.
 *
 * @param length The total number of buttons in the sequence (default 25).
 * @returns Array of formatted strings: "<number>;;<button-key>;;<pool-index>"
 */
export function generateGameSequence(length = 25): string[] {
  // Adjusted minimum length to safely accommodate the new 5-space dependency gap
  if (length < 8) {
    throw new Error('Sequence length must be at least 8 to accommodate the 5-space dependency gap.');
  }

  const sequence: PlacedButton[] = [];

  // 1. Game must always start with BASIC_PRESS
  sequence.push({
    key: 'BASIC_PRESS',
    targetCount: BUTTONS_LIBRARY['BASIC_PRESS'].targetCount,
    expectedAction: BUTTONS_LIBRARY['BASIC_PRESS'].expectedAction,
    level: BUTTONS_LIBRARY['BASIC_PRESS'].level,
  });

  const isRestrictedTarget = (tc: number) => tc === 0 || tc === -2;

  // Recursive Backtracking Function
  const solve = (currentIndex: number): boolean => {
    // Base Case: If we reached the final slot, place FINAL_PRESS
    if (currentIndex === length - 1) {
      sequence.push({
        key: 'FINAL_PRESS',
        targetCount: BUTTONS_LIBRARY['FINAL_PRESS'].targetCount,
        expectedAction: BUTTONS_LIBRARY['FINAL_PRESS'].expectedAction,
        level: BUTTONS_LIBRARY['FINAL_PRESS'].level,
      });
      return true;
    }

    const occurrences: Record<string, number> = {};
    const bannedByEitherOr = new Set<string>();

    // Tracker to ensure a healthy mix of difficulty levels
    const levelCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const btn of sequence) {
      occurrences[btn.key] = (occurrences[btn.key] || 0) + 1;
      const entry = BUTTONS_LIBRARY[btn.key];

      if (entry.eitherOr) {
        entry.eitherOr.forEach((k) => {
          bannedByEitherOr.add(k);
        });
      }

      // Tally level distributions, ignoring dependent buttons per your rules
      if (!entry.dependsOn) {
        levelCounts[entry.level] = (levelCounts[entry.level] || 0) + 1;
      }
    }

    // FIX 1: Shuffle the entire library upfront to completely eliminate top-to-bottom list bias
    const randomizedLibrary = shuffle(Object.values(BUTTONS_LIBRARY));

    let validCandidates = randomizedLibrary.filter((candidate) => {
      // RULE: FINAL_PRESS is strictly reserved for the end
      if (candidate.key === 'FINAL_PRESS') return false;

      // RULE: Max Occurrences
      const currentCount = occurrences[candidate.key] || 0;
      if (currentCount >= candidate.maxOccurrence) return false;

      // RULE: Mutual Exclusions
      if (bannedByEitherOr.has(candidate.key)) return false;
      if (candidate.eitherOr?.some((k) => occurrences[k])) return false;

      // RULE: Spacing (Cannot appear 2 in a row or within 2 positions)
      const last1 = sequence[currentIndex - 1]?.key;
      const last2 = sequence[currentIndex - 2]?.key;
      if (last1 === candidate.key || last2 === candidate.key) return false;

      // RULE: Dependencies (Must be present at least 5 buttons prior)
      if (candidate.dependsOn) {
        const depIdx = sequence.findIndex((b) => b.key === candidate.dependsOn);
        // FIX 2: Bumped dependency gap from 3 to 5
        if (depIdx === -1 || currentIndex - depIdx < 5) return false;
      }

      // RULE: SAME_AS_PREVIOUS Constraint
      if (candidate.key === 'SAME_AS_PREVIOUS') {
        const prev = sequence[currentIndex - 1];
        if (prev.expectedAction === 'ANY' || prev.expectedAction === 'TBD') return false;
      }

      // RULE: Target Count Streak
      if (isRestrictedTarget(candidate.targetCount)) {
        let streak = 0;
        for (let k = currentIndex - 1; k >= 0; k--) {
          if (isRestrictedTarget(sequence[k].targetCount)) streak++;
          else break;
        }
        if (streak >= 5) return false;
      }

      return true;
    });

    // RULE: Fallback Completion
    if (validCandidates.length === 0) {
      const fallbacks = [BUTTONS_LIBRARY['BASIC_PRESS'], BUTTONS_LIBRARY['BASIC_DO_NOT_PRESS']];
      validCandidates = shuffle(fallbacks).filter((candidate) => {
        const last1 = sequence[currentIndex - 1]?.key;
        const last2 = sequence[currentIndex - 2]?.key;
        if (last1 === candidate.key || last2 === candidate.key) return false;

        if (isRestrictedTarget(candidate.targetCount)) {
          let streak = 0;
          for (let k = currentIndex - 1; k >= 0; k--) {
            if (isRestrictedTarget(sequence[k].targetCount)) streak++;
            else break;
          }
          if (streak >= 5) return false;
        }
        return true;
      });
    }

    if (validCandidates.length === 0) return false;

    // FIX 3: Sort valid candidates to enforce the mix of levels and dependencies
    validCandidates.sort((a, b) => {
      // Priority 1: Ready Dependencies bubble to the top
      const aReady = a.dependsOn && occurrences[a.dependsOn] ? 1 : 0;
      const bReady = b.dependsOn && occurrences[b.dependsOn] ? 1 : 0;
      if (aReady !== bReady) return bReady - aReady;

      // Priority 2: Level Mix Balancer
      // Prioritize buttons whose difficulty level has appeared the LEAST so far.
      // Ties maintain the randomized shuffle order.
      const aLevelCount = a.dependsOn ? 0 : levelCounts[a.level] || 0;
      const bLevelCount = b.dependsOn ? 0 : levelCounts[b.level] || 0;

      return aLevelCount - bLevelCount;
    });

    // Attempt to place candidates
    for (const candidate of validCandidates) {
      let poolIndex: number | undefined;

      // RULE: Pool logic and 60% dependency matching
      if (candidate.pool && POOLS[candidate.pool]) {
        const poolSize = Object.values(POOLS[candidate.pool]).length;

        if (candidate.dependsOn) {
          const depBtn = sequence.find((b) => b.key === candidate.dependsOn);
          if (depBtn && depBtn.poolIndex !== undefined && random(1, 100) <= 60) {
            poolIndex = depBtn.poolIndex;
          } else {
            poolIndex = random(0, poolSize - 1);
          }
        } else {
          poolIndex = random(0, poolSize - 1);
        }
      }

      sequence.push({
        key: candidate.key,
        poolIndex,
        targetCount: candidate.targetCount,
        expectedAction: candidate.expectedAction,
        level: candidate.level,
      });

      // Recurse to the next index
      if (solve(currentIndex + 1)) {
        return true;
      }

      // If that path failed, pop the button off and try the next candidate
      sequence.pop();
    }

    return false;
  };

  const success = solve(1);

  if (!success) {
    console.warn('Could not generate a sequence matching all strict constraints for this length.');
  }

  // Format the final output: "<number>;;<button-key>;;<pool-index>"
  return sequence.map((btn, index) => {
    const poolStr = btn.poolIndex !== undefined ? btn.poolIndex.toString() : '';
    return `${index + 1};;${btn.key};;${poolStr}`;
  });
}
