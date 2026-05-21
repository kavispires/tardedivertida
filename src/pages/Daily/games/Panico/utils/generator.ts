import { random, sample } from 'lodash';
// Internal
import { BUTTONS_DICT, POOLS } from './data';

/**
 * Generates a random sequence of buttons for the game.
 *
 * @param length The total number of buttons in the sequence (default 25).
 * @returns Array of formatted strings: "index;;BUTTON_KEY;;poolIndex"
 */
export function generateGameSequence(length = 25): string[] {
  if (length < 2) {
    throw new Error('Sequence length must be at least 2 to accommodate start and end buttons.');
  }

  const sequence: Array<{ key: string; poolIndex?: number }> = [];
  const occurrences: Record<string, number> = {};
  const excludedKeys = new Set<string>();

  const appendButtonToSequence = (key: string) => {
    const btn = BUTTONS_DICT[key];

    occurrences[key] = (occurrences[key] || 0) + 1;

    if (btn.eitherOr) {
      btn.eitherOr.forEach((excludedKey) => {
        excludedKeys.add(excludedKey);
      });
    }

    let poolIndex: number | undefined;
    if (btn.pool && POOLS[btn.pool]) {
      const poolSize = Object.values(POOLS[btn.pool]).length;
      poolIndex = random(0, poolSize - 1);
    }

    sequence.push({ key, poolIndex });
  };

  // 1. Game must start with BASIC_PRESS
  appendButtonToSequence('BASIC_PRESS');

  // 2. Generate the middle sequence
  for (let i = 1; i < length - 1; i++) {
    const validCandidates = Object.values(BUTTONS_DICT).filter((btn) => {
      // --- RULE: Max Occurrences ---
      let maxAllowed = btn.maxOccurrence;
      // Reserve exactly 1 for the final required BASIC_PRESS
      if (btn.key === 'BASIC_PRESS') maxAllowed -= 1;

      if ((occurrences[btn.key] || 0) >= maxAllowed) return false;

      // --- RULE: Mutual Exclusions ---
      if (excludedKeys.has(btn.key)) return false;

      // --- RULE: Dependencies ---
      if (btn.dependsOn) {
        const depIndex = sequence.findIndex((s) => s.key === btn.dependsOn);
        if (depIndex === -1 || i - depIndex < 4) return false;
      }

      // --- RULE: SAME_AS_PREVIOUS Constraint ---
      // Can only come after a button whose expectedAction is NOT 'ANY' and NOT 'TBD'
      if (btn.key === 'SAME_AS_PREVIOUS') {
        const prevKey = sequence[i - 1].key;
        const prevAction = BUTTONS_DICT[prevKey].expectedAction;
        if (prevAction === 'ANY' || prevAction === 'TBD') {
          return false;
        }
      }

      return true;
    });

    if (validCandidates.length > 0) {
      // Normal flow: Pick a valid button
      const selectedBtn = sample(validCandidates)!;
      appendButtonToSequence(selectedBtn.key);
    } else {
      // --- RULE: Fallback Completion ---
      // If we run out of valid types, ignore maxOccurrence and fill with basic buttons
      const fallbackKey = sample(['BASIC_PRESS', 'BASIC_DO_NOT_PRESS'])!;
      appendButtonToSequence(fallbackKey);
    }
  }

  // 3. Game must end with FINAL_PRESS
  appendButtonToSequence('FINAL_PRESS');

  // 4. Format the final output strings
  return sequence.map((item, index) => {
    // Ensuring we don't print "undefined" if there's no pool
    const poolString = item.poolIndex !== undefined ? item.poolIndex.toString() : '';
    return `${index + 1};;${item.key};;${poolString}`;
  });
}
