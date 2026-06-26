# Achievements Tool-Kit Documentation

**Version:** 1.2.1

## Overview

Type-safe, declarative achievements system that:
- ✅ Provides full TypeScript autocomplete for achievement properties
- ✅ Auto-generates constants from definitions
- ✅ Reduces boilerplate by ~55%
- ✅ Includes documentation strings for development clarity
- ✅ Maintains backward compatibility with existing `achievement-utils.ts`
- ✅ Prevents using wrong methods on wrong achievement types
- ✅ Validates unique property names (except exactMatch can share with one other type)
- ✅ Adaptive exactMatch logic based on property type (array uses indexOf, counter/truthy use direct comparison)

---

## Quick Start

```typescript
import { GAME_KEYS } from '../../constants/games';
import { achievementBuilder } from '../../utils/tool-kits';

const achievements = achievementBuilder(GAME_KEYS.GAME_NAME)
  .counter('score', {
    doc: 'Total score accumulated',
    most: 'HIGHEST_SCORE',
    least: 'LOWEST_SCORE',
  })
  .array('weapons', {
    doc: 'Weapons selected each round',
    unique: {
      most: 'MOST_WEAPONS',
    },
  })
  .truthy('wonPerfectly', {
    doc: 'Won without mistakes',
    key: 'PERFECT_WIN',
  })
  .build();

// Export for use in game
export const {
  constants,
  setupAchievements,
  increaseAchievement,
  pushAchievement,
  setTruthyAchievement,
  calculateAchievements,
} = achievements;
```

**Note:** Use direct string literals for achievement IDs instead of importing from constants files. The toolkit auto-generates a `constants` object with all achievement IDs.

---

**Note:** Always use `GAME_KEYS` from `constants/games.ts` for the game prefix parameter, not plain strings.

---

## Important: Tie Handling

**By default, achievements are only awarded when a single player achieves them.**

- If **multiple players tie** for "most" or "least", **no one** receives the achievement
- **Exception:** `.truthy()` achievements award **all** players who meet the condition

This design ensures achievements feel special and meaningful. If you need different behavior, use `.custom()` with your own logic.

**Examples:**
- Two players tie for highest score → No "HIGHEST_SCORE" achievement awarded
- Three players all complete bonus objective → All three get "BONUS_COMPLETE" (if using `.truthy()`)

---

## Achievement Types

### 1. Counter

Tracks numeric values. Use `increase()` method. **Only awards if one player has uniquely highest/lowest value.**

```typescript
.counter('score', {
  doc: 'Total points scored',
  most: 'HIGHEST_SCORE',      // Award player with most (if unique)
  least: 'LOWEST_SCORE',      // Award player with least (if unique, optional)
  condition: (v) => v > 0,    // Only count positive values (optional)
  qualifier: (v) => v > 0,    // Filter players by counter value (optional)
})

// Usage:
achievements.increase(store.achievements, playerId, 'score', 10);
```

### 2. Array

Tracks lists of values. Different calculation methods available.

#### General Array (push)
```typescript
.array('weapons', {
  doc: 'Weapons selected across all rounds',
  unique: {
    most: 'MOST_DIFFERENT_WEAPONS',
    least: 'LEAST_DIFFERENT_WEAPONS',
  },
  qualifier: (v) => v !== 'none',  // Filter array values before calculation (optional)
})

// Usage:
achievements.push(store.achievements, playerId, 'weapons', 'knife');
```

#### Indexed Array (insert)
```typescript
.array('correct', {
  doc: 'Correct guesses per round',
  indexed: true,  // Enables insert() method
  occurrence: {
    earliest: 'EARLIEST_CORRECT',
    latest: 'LATEST_CORRECT',
  },
})

// Usage:
achievements.insert(store.achievements, playerId, 'correct', true, roundIndex);
```

#### Accumulated Array (push + addToLast)
```typescript
.array('roundScores', {
  doc: 'Score per round',
  accumulated: true,  // Enables addToLast() method
  average: {
    most: 'BEST_AVERAGE_SCORE',
  },
})

// Usage:
achievements.push(store.achievements, playerId, 'roundScores', 0); // Start new round
achievements.addToLast(store.achievements, playerId, 'roundScores', 10); // Add to current round
```

### 3. Exact Match

Checks if a property exactly matches a value. **Only awards if exactly one player matches.**

**Special feature:** `exactMatch` can share a property name with counter, array, or truthy types and will adapt its comparison logic automatically.

```typescript
// Standalone exactMatch (creates its own property)
.exactMatch('perfectScore', {
  doc: 'Achieved perfect score',
  key: 'PERFECT_SCORE',
  value: 100,
  property: 'finalScore',
})

// Shared with counter - uses direct comparison (v === value)
.counter('stops', {
  doc: 'Times pressed stop',
  most: 'MOST_STOPS'
})
.exactMatch('neverStopped', {
  doc: 'Never pressed stop',
  key: 'NEVER_STOPPED',
  value: 0,
  property: 'stops',  // Checks: stops === 0
})

// Shared with array - uses indexOf check (v.indexOf(value) !== -1)
.array('weapons', {
  doc: 'Weapons used',
  uniqueItems: { most: 'MOST_WEAPONS' }
})
.exactMatch('usedKnife', {
  doc: 'Used a knife',
  key: 'KNIFE_USER',
  value: 'knife',
  property: 'weapons',  // Checks: weapons.indexOf('knife') !== -1
})

// No tracking needed - automatically checks at calculation time
```

### 4. Truthy

Awards all players with truthy value. **Exception to tie rule: Multiple players can receive this.**

```typescript
.truthy('foundPerpetrator', {
  doc: 'Found the perpetrator',
  key: 'FOUND_PERPETRATOR',
})

// Usage:
achievements.setTruthy(store.achievements, playerId, 'foundPerpetrator');
```

### 5. Custom

For complex logic that doesn't fit standard patterns.

```typescript
.custom({
  doc: 'Player alone at non-final level',
  achievements: ['MOST_LONELY'],
  calculate: (achievements, players) => {
    // Your custom logic here
    const loner = findLonlyPlayer(players);
    return loner ? [{
      type: 'MOST_LONELY',
      playerId: loner.id,
      value: 1,
    }] : [];
  },
})
```

---

## Array Calculation Methods

### uniqueItems
Counts distinct values in the array.

```typescript
// ['knife', 'gun', 'knife', 'poison'] → 3 unique items
unique: {
  most: 'MOST_DIFFERENT_WEAPONS',
  least: 'LEAST_DIFFERENT_WEAPONS',
}
```

### occurrence
Finds earliest/latest truthy value index.

```typescript
// [false, false, true, true] → earliest at index 2
occurrence: {
  earliest: 'EARLIEST_CORRECT_GUESS',
  latest: 'LATEST_CORRECT_GUESS',
}
```

### average
Calculates average of numeric array.

```typescript
// [10, 20, 15] → average 15
average: {
  most: 'BEST_AVERAGE_SCORE',
  least: 'WORST_AVERAGE_SCORE',
}
```

### sum
Sum or count of items.

```typescript
// ['a', 'b', 'c', 'd'] → sum 4
sum: {
  most: 'MOST_CLUES_GIVEN',
  least: 'FEWEST_CLUES_GIVEN',
}
```

### extremes
Finds highest/lowest value within numeric arrays.

```typescript
// [10, 50, 25] → highest value 50
extremes: {
  highest: 'HIGHEST_BET',
  lowest: 'LOWEST_BET',
}
```

### run
Finds longest/shortest consecutive streak of a specific value.

```typescript
// [1, 1, 1, 0, 1, 1] → longest run of 1s is 3
run: {
  value: 1,
  longest: 'LONGEST_STREAK',
  shortest: 'SHORTEST_STREAK',
}
```

---

## Type-Safe Method Access

**The tool-kit prevents using wrong methods on wrong types:**

```typescript
const achievements = achievementBuilder('GAME')
  .counter('score', { most: 'MOST_SCORE' })
  .array('weapons', { uniqueItems: { most: 'MOST_WEAPONS' } })
  .build();

// ✅ ALLOWED - 'score' is a counter
achievements.increase(store.achievements, playerId, 'score', 10);

// ❌ TYPESCRIPT ERROR - 'score' is not an array
achievements.push(store.achievements, playerId, 'score', 'value');
//                                               ^^^^^^^
// Error: No overload matches this call

// ✅ ALLOWED - 'weapons' is an array
achievements.push(store.achievements, playerId, 'weapons', 'knife');

// ❌ TYPESCRIPT ERROR - 'weapons' is not a counter
achievements.increase(store.achievements, playerId, 'weapons', 1);
//                                                   ^^^^^^^^^
// Error: No overload matches this call
```

---

## Duplicate Property Validation

**Property names must be unique, with one exception for `exactMatch`:**

Each property name must be unique across all achievement types within a game. **However, `exactMatch` achievements can share a property name with one other type** (counter, array, or truthy), **OR be used standalone with its own unique property**.

### Standard Rules (No Duplicates)

```typescript
// ❌ RUNTIME ERROR - duplicate 'score' property between same types
const achievements = achievementBuilder(GAME_KEYS.GAME)
  .counter('score', {
    doc: 'Total score',
    most: 'MOST_SCORE'
  })
  .counter('score', {  // ← Error: 'score' already defined as counter
    doc: 'Different score metric',
    least: 'LEAST_SCORE'
  })
  .build();

// ❌ RUNTIME ERROR - duplicate 'weapons' property between different types
const achievements = achievementBuilder(GAME_KEYS.GAME)
  .array('weapons', {
    doc: 'Weapons selected',
    uniqueItems: { most: 'MOST_WEAPONS' }
  })
  .counter('weapons', {  // ← Error: 'weapons' already defined as array
    doc: 'Weapon count',
    most: 'MOST_WEAPON_COUNT'
  })
  .build();
```

### Exception: `exactMatch` Can Share

**`exactMatch` achievements can share a property name with counter, array, or truthy types, OR use its own unique property:**

```typescript
// ✅ ALLOWED - exactMatch standalone (its own property)
const achievements = achievementBuilder(GAME_KEYS.GAME)
  .exactMatch('perfectScore', {
    doc: 'Achieved perfect score of 100',
    key: 'PERFECT_SCORE',
    property: 'finalScore',  // Unique property, not shared
    value: 100
  })
  .build();

// ✅ ALLOWED - exactMatch shares with counter
const achievements = achievementBuilder(GAME_KEYS.GAME)
  .counter('stops', {
    doc: 'Number of times stopped',
    most: 'MOST_STOPS'
  })
  .exactMatch('neverStopped', {  // ✅ Shares 'stops' property
    doc: 'Never pressed stop',
    key: 'NEVER_STOPPED',
    property: 'stops',  // References the counter property
    value: 0
  })
  .build();

// ✅ ALLOWED - exactMatch shares with array
const achievements = achievementBuilder(GAME_KEYS.GAME)
  .array('weapons', {
    doc: 'Weapons used each round',
    uniqueItems: { most: 'MOST_DIFFERENT_WEAPONS' }
  })
  .exactMatch('usedKnife', {  // ✅ Shares 'weapons' property
    doc: 'Player used a knife',
  key: 'KNIFE_USER',
const achievements = achievementBuilder(GAME_KEYS.GAME)
  .truthy('foundClue', {
    doc: 'Found a clue',
    key: 'FOUND_CLUE'
  })
  .exactMatch('foundClueExactly', {  // ✅ Shares 'foundClue' property
    doc: 'Found clue with specific value',
    key: 'SPECIFIC_CLUE',
    property: 'foundClue',
    value: true
  })
  .build();
```

### How `exactMatch` Adapts

When `exactMatch` shares a property with another type, **it automatically adapts its comparison logic**:

| Shared With | Comparison Logic | Example |
|------------|------------------|---------|
| **Standalone** (no sharing) | Direct value comparison: `value === target` | `finalScore === 100` checks for perfect score |
| **counter** or **truthy** | Direct value comparison: `value === target` | `stops === 0` checks if player never stopped |
| **array** | Array contains check: `value.indexOf(target) !== -1` | `weapons.indexOf('knife') !== -1` checks if player used knife |

```typescript
// Example: Checking if player used a specific weapon
.array('weapons', {
  doc: 'Weapons selected across rounds',
  uniqueItems: { most: 'MOST_WEAPONS' }
})
.exactMatch('usedKnife', {
  doc: 'Used a knife at least once',
  key: 'KNIFE_USER',
  property: 'weapons',  // Array property
  value: 'knife'        // Checks: weapons.indexOf('knife') !== -1
})

// Example: Checking if player never stopped
.counter('stops', {
  doc: 'Times pressed stop',
  most: 'MOST_STOPS'
})
.exactMatch('neverStopped', {
  doc: 'Never stopped',
  key: 'NEVER_STOPPED',
  property: 'stops',    // Counter property
  value: 0              // Checks: stops === 0
})
```

### Why This Matters

- **Prevents conflicts**: Counter and array can't share properties (one expects number, other expects array)
- **Enables cross-checks**: `exactMatch` can validate specific conditions on tracked properties
- **Clean data**: One property = one data type (except for exactMatch validations)
- **Catches errors**: Typos and copy-paste mistakes fail fast

---

## Advanced Features

### Qualifier Filters

Filter values before calculations using the optional `qualifier` function.

#### Counter Qualifier

Exclude players from consideration based on their counter value:

```typescript
.counter('score', {
  doc: 'Total score',
  most: 'HIGHEST_SCORE',
  qualifier: (v) => v > 0,  // Only consider players with positive scores
})

// Players with score = 0 won't be considered for HIGHEST_SCORE
// Even if they technically have the lowest score
```

**Note:** `qualifier` and `condition` serve different purposes:
- **`condition`**: Validates individual value updates (e.g., must be positive when incrementing)
- **`qualifier`**: Filters players during achievement calculation (e.g., minimum threshold to qualify)
- Both can be used together - qualifier filters players, condition validates data

#### Array Qualifier

Filter array values before calculations:

```typescript
// Example 1: Exclude zeros from average calculation
.array('scores', {
  doc: 'Score per round',
  average: { most: 'BEST_AVERAGE' },
  qualifier: (v) => v > 0,  // Only count non-zero scores
})
// [10, 0, 20, 0, 15] → average of [10, 20, 15] = 15 (zeros excluded)

// Example 2: Exclude specific value from unique count
.array('answers', {
  doc: 'Player answers',
  unique: { most: 'MOST_UNIQUE' },
  qualifier: (v) => v !== 'B',  // Exclude answer 'B' from count
})
// ['A', 'B', 'C', 'B', 'A'] → unique count of ['A', 'C'] = 2

// Example 3: Filter by string length
.array('words', {
  doc: 'Words submitted',
  sum: { most: 'MOST_WORDS' },
  qualifier: (v) => v.length > 3,  // Only count words longer than 3 chars
})
// ['cat', 'elephant', 'ox', 'giraffe'] → count [elephant, giraffe] = 2

// Example 4: Filter before consecutive streak calculation
.array('results', {
  doc: 'Match results',
  run: {
    value: 'win',
    longest: 'LONGEST_WIN_STREAK',
  },
  qualifier: (v) => v !== 'bye',  // Exclude 'bye' matches from streak
})
// ['win', 'win', 'bye', 'win'] → filtered to ['win', 'win', 'win'] = streak of 2 then 1
```

**Applies to all calculation methods:**
- `unique`: Filters before counting distinct values
- `occurrence`: Filters before finding first/last occurrence
- `average`: Filters before calculating mean
- `sum`: Filters before summing/counting
- `extremes`: Filters before finding max/min
- `run`: Filters before calculating consecutive streaks

### Player Exclusions

Exclude specific players from achievement calculations using the `requiresExclusions` flag:

```typescript
// 1. Define with requiresExclusions flag
.counter('correct', {
  doc: 'Correct answers given',
  most: 'MOST_CORRECT',
  requiresExclusions: true,  // Flag that exclusions are required
})

// 2. Provide exclusions during calculate()
const alienId = findAlienId(players);
const results = achievements.calculate(
  store.achievements,
  { correct: [alienId] },  // exclusions object
  players
);
```

**Benefits:**
- Separation of definition from runtime data
- Type-safe validation (throws error if exclusions missing)
- Clearer intent at usage site

### Pre-Calculate Hook

Transform data before calculating achievements:

```typescript
.counter('uniqueActors', {
  doc: 'Number of unique actors voted for',
  most: 'MOST_ACTORS',
  preCalculate: (achievements, players) => {
    Object.values(players).forEach((player) => {
      const unique = uniq(player.votes).length;
      achievements[player.id].uniqueActors = unique;
    });
  },
})
```

---

## Complete Lifecycle Example

### 1. Definition
```typescript
// achievements.ts
import { GAME_KEYS } from '../../constants/games';
import { achievementBuilder } from '../../utils/tool-kits';

const adedanhxAchievements = achievementBuilder(GAME_KEYS.ADEDANHX)
  .counter('stops', {
    doc: 'Times player pressed stop',
    most: 'MOST_STOPS',
  })
  .counter('first', {
    doc: 'Times answered first',
    most: 'MOST_FIRST_ANSWERS',
    least: 'LEAST_FIRST_ANSWERS',
  })
  .exactMatch('neverStopped', {
    doc: 'Never pressed stop',
    key: 'NEVER_STOPPED',
    value: 0,
    property: 'stops',
  })
  .build();

export const ADEDANHX_ACHIEVEMENTS = adedanhxAchievements.constants;
export const {
  setupAchievements,
  increaseAchievement,
  calculateAchievements,
} = adedanhxAchievements;
```

### 2. Setup Phase
```typescript
// setup.ts - prepareSetupPhase
const achievements = setupAchievements(getListOfPlayersIds(players));
// Returns: {
//   player1: { stops: 0, first: 0 },
//   player2: { stops: 0, first: 0 },
// }

return {
  update: {
    store: {
      achievements, // Saved to Firebase
    },
  },
};
```

### 3. Gameplay Tracking
```typescript
// helpers.ts, actions.ts
increaseAchievement(store.achievements, playerId, 'stops', 1);
increaseAchievement(store.achievements, playerId, 'first', 1);

// ✅ Autocomplete shows: 'stops', 'first'
// ❌ TypeScript error on typos: 'stpos', 'frst'
```

### 4. Game Over Calculation
```typescript
// setup.ts - prepareGameOverPhase
const achievementResults = getAchievements(store.achievements);
// Returns: [
//   { type: 'MOST_STOPS', playerId: 'player1', value: 5 },
//   { type: 'MOST_FIRST_ANSWERS', playerId: 'player2', value: 10 },
//   { type: 'NEVER_STOPPED', playerId: 'player3', value: 0 },
// ]

return {
  set: {
    state: {
      achievements: achievementResults,
    },
  },
};
```

---

## Migration from Old System

**For new games:** Use the tool-kit from the start.

**For existing games:** Keep the old system. When ready to migrate:

### Step-by-Step Migration


1. **Create `achievements.ts` file** in your game's engine folder
   ```typescript
   /**
     * GAME_NAME ACHIEVEMENTS
    * Type-safe achievement definitions using the achievements toolkit
    */

    import { GAME_KEYS } from '../../constants/games';
    import { achievementBuilder } from '../../utils/tool-kits';

    /**
    * Build achievement utilities for Game Name game
    */
   const gameAchievements = achievementBuilder(GAME_KEYS.GAME_NAME)
     .counter('score', {
       doc: 'Points scored',
       most: 'HIGHEST_SCORE',  // ✅ Use direct strings, not constants
     })
     .build();

   export const {
     constants,
     setupAchievements,
     increaseAchievement,
     calculateAchievements,
   } = gameAchievements;
   ```

2. **Update imports in game files**
   ```typescript
   // In setup.ts, helpers.ts, etc.
   import { setupAchievements, increaseAchievement, calculateAchievements } from './achievements';
   ```

3. **Replace method calls**:
   - `utils.achievements.setup(players, { ... })` → `setupAchievements(getListOfPlayersIds(players))`
   - `utils.achievements.increase(store, playerId, prop, val)` → `increaseAchievement(store.achievements, playerId, prop, val)`
   - `getAchievements(store)` → `getAchievements(store.achievements)`

4. **Remove old achievement calculation function** from `helpers.ts`

5. **Test thoroughly** - achievements should work identically

6. **Remove the old achievement constant and type in `constants.ts` or `types.d.ts`**.

7. **Run `yarn achievements <game-name>`to update the UI section automatically.** - Don't don't any modifications on the UI file.

### Key Differences

| Old System | New Tool-Kit |
|------------|--------------|
| Define constants in `constants.ts` | Use direct strings in builder |
| Manual type: `keyof typeof GAME_ACHIEVEMENTS` | Auto-generated from builder |
| Setup with object: `{ score: 0, ... }` | Setup inferred from definitions |
| Calculate in `helpers.ts` (~80 lines) | Auto-generated `calculate()` |
| Store tracking in multiple files | Single `achievements.ts` file |

---

## Benefits

1. **✅ Type Safety** - Can't use wrong method on wrong property type
2. **✅ Autocomplete** - IntelliSense shows valid properties per method
3. **✅ Single Source** - One file defines everything
4. **✅ Documentation** - `doc` field explains what's tracked
5. **✅ Less Boilerplate** - ~55% code reduction
6. **✅ Prevent Errors** - Impossible to typo property names
7. **✅ Clear Intent** - Method name shows data type
8. **✅ Smart Validation** - Prevents duplicate properties (except exactMatch can share to validate tracked data)
9. **✅ Adaptive Logic** - exactMatch automatically adjusts comparison based on property type (array vs counter)

---

## API Reference

### achievementBuilder(gamePrefix)

Creates a new achievement builder.

**Parameters:**
- `gamePrefix` (string): Game key from GAME_KEYS (e.g., `GAME_KEYS.ADEDANHX`)

**Returns:** Builder instance

**Example:**
```typescript
import { GAME_KEYS } from '../../constants/games';
import { achievementBuilder } from '../../utils/tool-kits';

const achievements = achievementBuilder(GAME_KEYS.MY_GAME);
```

---

### .counter(property, config)

Define a numeric counter achievement.

**Config:**
- `doc` (string): Development documentation
- `most` (string | null): Achievement ID for highest value
- `least` (string | null): Achievement ID for lowest value (optional)
- `condition` ((value) => boolean): Validation function for individual updates (optional)
- `qualifier` ((value: number) => boolean): Filter function to determine player eligibility for awards (optional)
- `requiresExclusions` (boolean): Flag indicating exclusions required during calculate() (optional)
- `preCalculate` ((achievements, players) => void): Pre-calculation hook (optional)

---

### .array(property, config)

Define an array achievement.

**Config:**
- `doc` (string): Development documentation
- `indexed` (boolean): Enable insert() method (optional)
- `accumulated` (boolean): Enable addToLast() method (optional)
- `qualifier` ((value: any) => boolean): Filter function to qualify array values before calculation (optional)
- `unique` ({ most, least }): Count unique items (optional)
- `occurrence` ({ earliest, latest }): Find first/last occurrence (optional)
- `average` ({ most, least }): Calculate average (optional)
- `sum` ({ most, least }): Calculate sum/count (optional)
- `extremes` ({ highest, lowest }): Find extreme values in numeric array (optional)
- `run` ({ value, longest, shortest }): Find longest/shortest consecutive streak of specific value (optional)
- `requiresExclusions` (boolean): Flag indicating exclusions required during calculate() (optional)
- `preCalculate` ((achievements, players) => void): Pre-calculation hook (optional)

---

### .exactMatch(property, config)

Define an exact match achievement.

**Config:**
- `doc` (string): Development documentation
- `key` (string): Achievement ID
- `value` (any): Exact value to match
- `property` (string): Existing property to check (optional)
- `requiresExclusions` (boolean): Flag indicating exclusions required during calculate() (optional)

---

### .truthy(property, config)

Define a truthy achievement.

**Config:**
- `doc` (string): Development documentation
- `key` (string): Achievement ID

---

### .custom(config)

Define a custom achievement.

**Config:**
- `doc` (string): Development documentation
- `achievements` (string[]): Achievement IDs this creates
- `calculate` ((achievements, players) => Achievement[]): Custom logic

---

### .build()

Finalize and return achievement utilities.

**Returns:**
```typescript
{
  constants: { ACHIEVEMENT_ID: 'ACHIEVEMENT_ID', ... },
  AchievementType: string union type,
  setup: (playerIds: string[]) => Achievements,
  increase: (achievements, playerId, property, value) => void,
  push: (achievements, playerId, property, value) => void,
  insert: (achievements, playerId, property, value, index) => void,
  addToLast: (achievements, playerId, property, value) => void,
  setTruthy: (achievements, playerId, property) => void,
  calculate: (achievements, exclusions?, players?) => Achievement[],
}
```

---

## Notes

- **Backend Storage:** Only stores `doc` string for developer reference
- **Frontend UI:** Icon, title, and description remain in frontend `achievementsReference`
- **Backward Compatible:** Old `achievement-utils.ts` remains unchanged
- **All Methods:** Receive `store.achievements`, not full `store` object

---

For implementation details and edge cases, see the source code in `achievements.ts`.
