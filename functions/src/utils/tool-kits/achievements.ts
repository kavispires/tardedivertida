/**
 * TD ACHIEVEMENTS TOOLKIT
 * Version 1.2.0
 *
 * Type-safe, declarative achievements system with method overloading
 * to prevent misuse of tracking methods on wrong achievement types.
 *
 * This toolkit is self-contained and only requires lodash as an external dependency.
 */

import { cloneDeep, mean, uniq } from 'lodash';

// ========================================
// SELF-CONTAINED TYPES
// ========================================

/**
 * Generic object with string keys and any values
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic object type for flexible achievement storage
type PlainObject = Record<string, any>;

/**
 * Represents a value that can be of any type or unknown, used for flexibility in type definitions
 */
// biome-ignore lint/suspicious/noExplicitAny: on purpose
type AnyOrUnknownPlaceholder = any | unknown;

/**
 * Player object structure (minimal required fields)
 */
type Player = {
  id: string;
  [key: string]: AnyOrUnknownPlaceholder;
};

/**
 * Players dictionary keyed by player ID
 */
type Players = Record<string, Player>;

/**
 * Achievement result structure
 */
type Achievement<T extends string> = {
  type: T;
  playerId: string;
  value: number;
};

// ========================================
// INTERNAL UTILITY FUNCTIONS
// ========================================

interface StoreAchievement {
  playerId: string;
  [key: string]: AnyOrUnknownPlaceholder;
}

interface ResultAchievement {
  playerId: string;
  value: number;
}

type AchievementResult = {
  most: ResultAchievement | null;
  least: ResultAchievement | null;
};

/**
 * Calculates the average (mean) of an array of numbers
 */
const _calculateAverage = (values: number[], round = false): number => {
  if (!values || values.length === 0) {
    return 0;
  }

  const average = mean(values);

  if (round) {
    return Math.round(average);
  }

  return average;
};

/**
 * Calculates the longest consecutive streak of a specific value in an array
 */
const _calculateLongestRun = (
  values: (string | number | boolean)[],
  target: string | number | boolean,
): number => {
  let currentStreak = 0;
  let longestStreak = 0;

  values.forEach((v) => {
    if (v === target) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  });

  return longestStreak;
};

/**
 * Sets up achievements by creating an achievements object with every player and given starting properties
 */
const _setupAchievements = (playerIds: string[], properties: PlainObject): PlainObject => {
  const achievements = {};
  playerIds.forEach((playerId) => {
    achievements[playerId] = { ...cloneDeep(properties), playerId };
  });
  return achievements;
};

/**
 * Get the exact value of a property and returns it in a ResultAchievement object
 */
const _getValue = (achievement: StoreAchievement, property: string): ResultAchievement => {
  return {
    playerId: achievement.playerId,
    value: achievement[property] ?? 0,
  };
};

/**
 * Adds a numeric value to given property in the achievements
 */
const _increaseAchievement = (
  achievements: PlainObject,
  playerId: string,
  property: string,
  value: number,
): void => {
  if (achievements[playerId] !== undefined) {
    achievements[playerId][property] = (achievements[playerId][property] || 0) + value;
  }
};

/**
 * Pushes a value to the achievements property array
 */
const _pushToAchievement = (
  achievements: PlainObject,
  playerId: string,
  property: string,
  value: unknown,
): void => {
  if (achievements[playerId] !== undefined) {
    achievements[playerId][property].push(value);
  }
};

/**
 * Inserts a value in a specific array index
 */
const _insertIntoAchievement = (
  achievements: PlainObject,
  playerId: string,
  property: string,
  value: unknown,
  index: number,
): void => {
  if (achievements[playerId] !== undefined) {
    achievements[playerId][property][index] = value;
  }
};

/**
 * Adds a value to the last element of a specified property array
 */
const _addToLastAchievement = (
  achievements: PlainObject,
  playerId: string,
  property: string,
  value: number,
): void => {
  if (achievements[playerId] !== undefined) {
    const arr = achievements[playerId][property];
    arr[arr.length - 1] += value;
  }
};

/**
 * Get most and least of certain value else return null
 */
const _getMostAndLeastOf = (
  achievements: PlainObject,
  property: string,
  ineligiblePlayers: string[] = [],
  // biome-ignore lint/suspicious/noExplicitAny: Condition function needs to handle any value type
  condition: (value: any) => boolean = () => true,
): AchievementResult => {
  let most: StoreAchievement[] = [];
  let least: StoreAchievement[] = [];

  const eligibleAchievements = Object.values<StoreAchievement>(achievements).filter(
    (a) => !ineligiblePlayers.includes(a.playerId),
  );

  eligibleAchievements.forEach((achievement) => {
    if (condition(achievement[property])) {
      if (!most[0] || most[0][property] === achievement[property]) {
        most.push(achievement);
      } else if (most[0][property] < achievement[property]) {
        most = [achievement];
      }

      if (!least[0] || least[0][property] === achievement[property]) {
        least.push(achievement);
      } else if (least[0][property] > achievement[property]) {
        least = [achievement];
      }
    }
  });

  return {
    most: most.length === 1 ? _getValue(most[0], property) : null,
    least: least.length === 1 ? _getValue(least[0], property) : null,
  };
};

/**
 * Get most and least based on the average of the array of values
 */
const _getMostAndLeastOfAverage = (
  achievements: PlainObject,
  property: string,
  ineligiblePlayers: string[] = [],
  // biome-ignore lint/suspicious/noExplicitAny: Qualifier needs to handle any value type
  qualifier?: (value: any) => boolean,
): AchievementResult => {
  const eligibleAchievements = Object.values<StoreAchievement>(achievements).filter(
    (a) => !ineligiblePlayers.includes(a.playerId),
  );

  const achievementsAverages = eligibleAchievements.map((achievement) => {
    const clonedAchievement = { ...achievement };
    if (Array.isArray(achievement[property]) && achievement[property].every(Number)) {
      const values = qualifier ? achievement[property].filter(qualifier) : achievement[property];
      clonedAchievement[property] = _calculateAverage(values, true);
    }
    return clonedAchievement;
  });

  return _getMostAndLeastOf(
    achievementsAverages.reduce((acc, a) => {
      acc[a.playerId] = a;
      return acc;
    }, {} as PlainObject),
    property,
    ineligiblePlayers,
  );
};

/**
 * Get most and least based on the unique items of the array of values
 */
const _getMostAndLeastUniqueItemsOf = (
  achievements: PlainObject,
  property: string,
  ineligiblePlayers: string[] = [],
  // biome-ignore lint/suspicious/noExplicitAny: Qualifier needs to handle any value type
  qualifier?: (value: any) => boolean,
): AchievementResult => {
  const modifiedAchievements = Object.values<StoreAchievement>(achievements).reduce((acc, achievement) => {
    const clonedAchievement = { ...achievement };
    const values = qualifier ? achievement[property].filter(qualifier) : achievement[property];
    clonedAchievement[property] = uniq(values).length;
    acc[achievement.playerId] = clonedAchievement;
    return acc;
  }, {} as PlainObject);

  return _getMostAndLeastOf(modifiedAchievements, property, ineligiblePlayers);
};

/**
 * Get highest and lowest values from numeric arrays
 */
const _getHighestAndLowestValues = (
  achievements: PlainObject,
  property: string,
  ineligiblePlayers: string[] = [],
  // biome-ignore lint/suspicious/noExplicitAny: Qualifier needs to handle any value type
  qualifier?: (value: any) => boolean,
): AchievementResult => {
  const modifiedAchievements = Object.values<StoreAchievement>(achievements).reduce((acc, achievement) => {
    const clonedAchievement = { ...achievement };
    if (Array.isArray(achievement[property]) && achievement[property].length > 0) {
      const values = qualifier ? achievement[property].filter(qualifier) : achievement[property];
      // Find max value in the array
      clonedAchievement[property] = values.length > 0 ? Math.max(...values) : 0;
    } else {
      clonedAchievement[property] = 0;
    }
    acc[achievement.playerId] = clonedAchievement;
    return acc;
  }, {} as PlainObject);

  return _getMostAndLeastOf(modifiedAchievements, property, ineligiblePlayers, (v) => v > 0);
};

/**
 * Get earliest and latest occurrence based on findIndex
 */
const _getEarliestAndLatestOccurrence = (
  achievements: PlainObject,
  property: string,
  ineligiblePlayers: string[] = [],
  // biome-ignore lint/suspicious/noExplicitAny: Qualifier needs to handle any value type
  qualifier?: (value: any) => boolean,
): AchievementResult => {
  const modifiedAchievements = Object.values<StoreAchievement>(achievements).reduce((acc, achievement) => {
    const clonedAchievement = { ...achievement };
    const values = qualifier ? achievement[property].filter(qualifier) : achievement[property];
    clonedAchievement[property] = values.findIndex(Boolean);
    acc[achievement.playerId] = clonedAchievement;
    return acc;
  }, {} as PlainObject);

  return _getMostAndLeastOf(modifiedAchievements, property, ineligiblePlayers, (v) => v >= 0);
};

/**
 * Get the only achievement that exactly matches the specified property and value
 */
const _getOnlyExactMatch = (
  achievements: PlainObject,
  property: string,
  value: unknown,
  ineligiblePlayers: string[] = [],
  propertyType?: 'counter' | 'array' | 'truthy',
): ResultAchievement | null => {
  const eligibleAchievements = Object.values<StoreAchievement>(achievements).filter(
    (a) => !ineligiblePlayers.includes(a.playerId),
  );

  // Adapt comparison based on property type
  const matches = eligibleAchievements.filter((achievement) => {
    const propertyValue = achievement[property];

    if (propertyType === 'array') {
      // For arrays, check if value exists in the array
      return Array.isArray(propertyValue) && propertyValue.indexOf(value) !== -1;
    }

    // For counter, truthy, or undefined type, use direct comparison
    return propertyValue === value;
  });

  return matches.length === 1 ? _getValue(matches[0], property) : null;
};

/**
 * Get all player IDs that have a truthy value for the specified achievement property
 */
const _getPlayersWithTruthyAchievement = (
  achievements: PlainObject,
  property: string,
  ineligiblePlayers: string[] = [],
): string[] => {
  const eligibleAchievements = Object.values<StoreAchievement>(achievements).filter(
    (a) => !ineligiblePlayers.includes(a.playerId),
  );

  return eligibleAchievements.filter((a) => Boolean(a[property])).map((a) => a.playerId);
};

// ========================================
// TYPES
// ========================================

/**
 * Achievement property types
 */
type AchievementPropertyType = 'counter' | 'array' | 'truthy' | 'exactMatch' | 'custom';

/**
 * Base configuration shared by all achievement types
 */
type BaseConfig = {
  /**
   * Development documentation explaining what this achievement tracks
   */
  doc: string;
  /**
   * Flag indicating this achievement requires excluded player IDs during calculate().
   * When true, must provide an exclusions object with this property's exclusion list.
   */
  requiresExclusions?: boolean;
};

/**
 * Counter achievement configuration
 */
type CounterConfig = BaseConfig & {
  /**
   * Achievement ID for player with highest value (null to skip)
   */
  most: string | null;
  /**
   * Achievement ID for player with lowest value (null to skip)
   */
  least?: string | null;
  /**
   * Condition to validate values (e.g., must be positive)
   */
  condition?: (value: number) => boolean;
  /**
   * Filter function to determine player eligibility for awards.
   * Only players whose counter value passes this filter will be considered.
   * Use cases: minimum threshold, exclude zeros, only even/odd values.
   */
  qualifier?: (value: number) => boolean;
  /**
   * Pre-calculate values before determining winners.
   * Use this to modify achievement values before comparison (e.g., apply bonuses, combine properties).
   * Called during calculate() with access to full player data.
   * @param achievements - The achievements object to modify
   * @param players - Full players object with all game data
   */
  preCalculate?: (achievements: PlainObject, players: Players) => void;
};

/**
 * Array achievement configuration
 */
type ArrayConfig = BaseConfig & {
  /**
   * Enable insert() method for indexed arrays
   */
  indexed?: boolean;
  /**
   * Enable addToLast() method for accumulated arrays
   */
  accumulated?: boolean;
  /**
   * Filter function to qualify array values before calculation.
   * Only values that return true will be included in calculations.
   * Use cases: exclude zeros, filter by length, exclude specific values.
   */
  // biome-ignore lint/suspicious/noExplicitAny: Qualifier needs to handle any value type
  qualifier?: (value: any) => boolean;
  /**
   * Count unique items and award most/least
   */
  unique?: {
    most?: string | null;
    least?: string | null;
  };
  /**
   * Find earliest/latest truthy occurrence
   */
  occurrence?: {
    earliest?: string | null;
    latest?: string | null;
  };
  /**
   * Calculate average and award most/least
   */
  average?: {
    most?: string | null;
    least?: string | null;
  };
  /**
   * Calculate sum/length and award most/least
   */
  sum?: {
    most?: string | null;
    least?: string | null;
  };
  /**
   * Find extreme values (highest/lowest) in numeric array
   */
  extremes?: {
    highest?: string | null;
    lowest?: string | null;
  };
  /**
   * Calculate longest/shortest consecutive run of a specific value
   */
  run?: {
    /**
     * The target value to count consecutive occurrences of
     */
    value: string | number | boolean;
    /**
     * Award for longest consecutive streak
     */
    longest?: string | null;
    /**
     * Award for shortest consecutive streak (minimum 1)
     */
    shortest?: string | null;
  };
  /**
   * Pre-calculate values before determining winners.
   * Use this to modify achievement values before comparison (e.g., apply bonuses, combine properties).
   * Called during calculate() with access to full player data.
   * @param achievements - The achievements object to modify
   * @param players - Full players object with all game data
   */
  preCalculate?: (achievements: PlainObject, players: Players) => void;
};

/**
 * Exact match achievement configuration
 */
type ExactMatchConfig = {
  /**
   * Development documentation
   */
  doc: string;
  /**
   * Achievement ID to award
   */
  key: string;
  /**
   * Exact value to match
   */
  value: unknown;
  /**
   * Property to check (if different from the defined property name)
   */
  property?: string;
  /**
   * Flag indicating this achievement requires excluded player IDs during calculate()
   */
  requiresExclusions?: boolean;
};

/**
 * Truthy achievement configuration
 */
type TruthyConfig = {
  /**
   * Development documentation
   */
  doc: string;
  /**
   * Achievement ID to award to all truthy players
   */
  key: string;
};

/**
 * Custom achievement configuration
 */
type CustomConfig = {
  /**
   * Development documentation
   */
  doc: string;
  /**
   * List of achievement IDs this custom logic creates
   */
  achievements: string[];
  /**
   * Custom calculation logic
   */
  calculate: (achievements: PlainObject, players: Players) => Achievement<string>[];
};

/**
 * Achievement definition stored during building
 */
type AchievementDefinition =
  | { type: 'counter'; property: string; config: CounterConfig }
  | { type: 'array'; property: string; config: ArrayConfig }
  | { type: 'exactMatch'; property: string; config: ExactMatchConfig }
  | { type: 'truthy'; property: string; config: TruthyConfig }
  | { type: 'custom'; property: string; config: CustomConfig };

// ========================================
// BUILDER CLASS
// ========================================

class AchievementBuilderClass<TDefinitions extends AchievementDefinition[] = []> {
  private gamePrefix: string;
  private definitions: AchievementDefinition[];

  constructor(gamePrefix: string, definitions: AchievementDefinition[] = []) {
    this.gamePrefix = gamePrefix;
    this.definitions = definitions;
  }

  /**
   * Check if a property name already exists (runtime validation)
   * Allows duplicates only when one type is 'exactMatch'
   */
  private checkDuplicateProperty(property: string, type: string): void {
    const existingProperty = this.definitions.find((def) => def.property === property);

    if (existingProperty) {
      // Allow duplicate if one is exactMatch and types are different
      const isDuplicateAllowed =
        (existingProperty.type === 'exactMatch' && type !== 'exactMatch') ||
        (existingProperty.type !== 'exactMatch' && type === 'exactMatch');

      if (!isDuplicateAllowed) {
        throw new Error(
          `Achievement property "${property}" is already defined as type "${existingProperty.type}" in ${this.gamePrefix}. ` +
            'Each property name must be unique across all achievement types (except exactMatch can share with one other type).',
        );
      }
    }
  }

  /**
   * Track a numeric value that can be increased during gameplay.
   * Awards 'most' and/or 'least' achievements to the single player with highest/lowest total.
   * If multiple players tie, no achievement is awarded.
   * Use case: Points scored, times stopped, rounds won, mistakes made.
   */
  counter<TProperty extends string>(
    property: TProperty,
    config: CounterConfig,
  ): AchievementBuilderClass<
    [...TDefinitions, { type: 'counter'; property: TProperty; config: CounterConfig }]
  > {
    this.checkDuplicateProperty(property, 'counter');

    const newDefinitions = [
      ...this.definitions,
      { type: 'counter' as const, property, config },
    ] as AchievementDefinition[];

    // biome-ignore lint/suspicious/noExplicitAny: Type system limitation - builder pattern requires type assertion
    return new AchievementBuilderClass(this.gamePrefix, newDefinitions) as any;
  }

  /**
   * Track a list of values collected during gameplay.
   * Supports multiple calculation methods:
   * - average (use most/least to award mean values)
   * - extreme (use highest/lowest to award top and lowest values)
   * - occurrence (use earliest/latest to award first and last occurrences)
   * - run (use longest/shortest to award consecutive streaks of a specific value)
   * - sum (use most/least to award total counts)
   * - unique (use most/least to award players with the most unique items)
   * If multiple players tie, no achievement is awarded.
   */
  array<TProperty extends string>(
    property: TProperty,
    config: ArrayConfig,
  ): AchievementBuilderClass<[...TDefinitions, { type: 'array'; property: TProperty; config: ArrayConfig }]> {
    this.checkDuplicateProperty(property, 'array');

    const newDefinitions = [
      ...this.definitions,
      { type: 'array' as const, property, config },
    ] as AchievementDefinition[];

    // biome-ignore lint/suspicious/noExplicitAny: Type system limitation - builder pattern requires type assertion
    return new AchievementBuilderClass(this.gamePrefix, newDefinitions) as any;
  }

  /**
   * Award achievement to the single player whose tracked value exactly matches a target.
   * If multiple players match (or none match), no achievement is awarded.
   * Use case: Never stopped (stops === 0), perfect score (score === maxScore), no mistakes.
   */
  exactMatch<TProperty extends string>(
    property: TProperty,
    config: ExactMatchConfig,
  ): AchievementBuilderClass<
    [...TDefinitions, { type: 'exactMatch'; property: TProperty; config: ExactMatchConfig }]
  > {
    this.checkDuplicateProperty(property, 'exactMatch');

    const newDefinitions = [
      ...this.definitions,
      { type: 'exactMatch' as const, property, config },
    ] as AchievementDefinition[];

    // biome-ignore lint/suspicious/noExplicitAny: Type system limitation - builder pattern requires type assertion
    return new AchievementBuilderClass(this.gamePrefix, newDefinitions) as any;
  }

  /**
   * Award achievement to ALL players whose tracked value is truthy.
   * Unlike other types, this awards to multiple players (no tie restriction).
   * Use case: Completed a bonus objective, won at least once, unlocked a feature.
   */
  truthy<TProperty extends string>(
    property: TProperty,
    config: TruthyConfig,
  ): AchievementBuilderClass<
    [...TDefinitions, { type: 'truthy'; property: TProperty; config: TruthyConfig }]
  > {
    this.checkDuplicateProperty(property, 'truthy');

    const newDefinitions = [
      ...this.definitions,
      { type: 'truthy' as const, property, config },
    ] as AchievementDefinition[];

    // biome-ignore lint/suspicious/noExplicitAny: Type system limitation - builder pattern requires type assertion
    return new AchievementBuilderClass(this.gamePrefix, newDefinitions) as any;
  }

  /**
   * Define achievements with custom calculation logic for complex scenarios.
   * Provides full control over achievement awarding logic.
   * Use case: Conditional combinations, complex formulas, multiple related achievements.
   */
  custom(
    config: CustomConfig,
  ): AchievementBuilderClass<[...TDefinitions, { type: 'custom'; property: ''; config: CustomConfig }]> {
    const newDefinitions = [
      ...this.definitions,
      { type: 'custom' as const, property: '', config },
    ] as AchievementDefinition[];

    // biome-ignore lint/suspicious/noExplicitAny: Type system limitation - builder pattern requires type assertion
    return new AchievementBuilderClass(this.gamePrefix, newDefinitions) as any;
  }

  /**
   * Build and return type-safe achievement utilities
   */
  build() {
    return buildAchievementUtils(this.gamePrefix, this.definitions as TDefinitions);
  }
}

// ========================================
// HELPER TYPES
// ========================================

/**
 * Extract property names by type
 */
type ExtractPropertiesByType<
  TDefinitions extends AchievementDefinition[],
  TType extends AchievementPropertyType,
> = Extract<TDefinitions[number], { type: TType }>['property'];

/**
 * Extract counter properties
 */
type CounterProperties<TDefinitions extends AchievementDefinition[]> = ExtractPropertiesByType<
  TDefinitions,
  'counter'
>;

/**
 * Extract array properties
 */
type ArrayProperties<TDefinitions extends AchievementDefinition[]> = ExtractPropertiesByType<
  TDefinitions,
  'array'
>;

/**
 * Extract truthy properties
 */
type TruthyProperties<TDefinitions extends AchievementDefinition[]> = ExtractPropertiesByType<
  TDefinitions,
  'truthy'
>;

/**
 * Generate constants object type
 */
type GenerateConstants<TDefinitions extends AchievementDefinition[]> = {
  [K in TDefinitions[number] as K extends { config: { most: string } }
    ? K['config']['most']
    : K extends { config: { least: string } }
      ? K['config']['least']
      : K extends { config: { key: string } }
        ? K['config']['key']
        : K extends { config: { achievements: string[] } }
          ? K['config']['achievements'][number]
          : never]: string;
};

// ========================================
// BUILD FUNCTION
// ========================================

/**
 * Build achievement utilities from definitions
 */
function buildAchievementUtils<TDefinitions extends AchievementDefinition[]>(
  _gamePrefix: string,
  definitions: TDefinitions,
) {
  // Generate constants
  const constants: Record<string, string> = {};
  const achievementTypeValues: string[] = [];

  definitions.forEach((def) => {
    if (def.type === 'counter' || def.type === 'array') {
      const config = def.config as CounterConfig | ArrayConfig;
      if ('most' in config && config.most) {
        constants[config.most] = config.most;
        achievementTypeValues.push(config.most);
      }
      if ('least' in config && config.least) {
        constants[config.least] = config.least;
        achievementTypeValues.push(config.least);
      }
      // Handle array-specific achievements
      if ('unique' in config && config.unique) {
        if (config.unique.most) {
          constants[config.unique.most] = config.unique.most;
          achievementTypeValues.push(config.unique.most);
        }
        if (config.unique.least) {
          constants[config.unique.least] = config.unique.least;
          achievementTypeValues.push(config.unique.least);
        }
      }
      if ('occurrence' in config && config.occurrence) {
        if (config.occurrence.earliest) {
          constants[config.occurrence.earliest] = config.occurrence.earliest;
          achievementTypeValues.push(config.occurrence.earliest);
        }
        if (config.occurrence.latest) {
          constants[config.occurrence.latest] = config.occurrence.latest;
          achievementTypeValues.push(config.occurrence.latest);
        }
      }
      if ('average' in config && config.average) {
        if (config.average.most) {
          constants[config.average.most] = config.average.most;
          achievementTypeValues.push(config.average.most);
        }
        if (config.average.least) {
          constants[config.average.least] = config.average.least;
          achievementTypeValues.push(config.average.least);
        }
      }
      if ('sum' in config && config.sum) {
        if (config.sum.most) {
          constants[config.sum.most] = config.sum.most;
          achievementTypeValues.push(config.sum.most);
        }
        if (config.sum.least) {
          constants[config.sum.least] = config.sum.least;
          achievementTypeValues.push(config.sum.least);
        }
      }
      if ('extremes' in config && config.extremes) {
        if (config.extremes.highest) {
          constants[config.extremes.highest] = config.extremes.highest;
          achievementTypeValues.push(config.extremes.highest);
        }
        if (config.extremes.lowest) {
          constants[config.extremes.lowest] = config.extremes.lowest;
          achievementTypeValues.push(config.extremes.lowest);
        }
      }
      if ('run' in config && config.run) {
        if (config.run.longest) {
          constants[config.run.longest] = config.run.longest;
          achievementTypeValues.push(config.run.longest);
        }
        if (config.run.shortest) {
          constants[config.run.shortest] = config.run.shortest;
          achievementTypeValues.push(config.run.shortest);
        }
      }
    } else if (def.type === 'exactMatch' || def.type === 'truthy') {
      const config = def.config as ExactMatchConfig | TruthyConfig;
      constants[config.key] = config.key;
      achievementTypeValues.push(config.key);
    } else if (def.type === 'custom') {
      const config = def.config as CustomConfig;
      config.achievements.forEach((achievement) => {
        constants[achievement] = achievement;
        achievementTypeValues.push(achievement);
      });
    }
  });

  // Setup function
  const setup = (playerIds: string[]): PlainObject => {
    const initialProperties: PlainObject = {};

    definitions.forEach((def) => {
      if (def.type === 'counter') {
        initialProperties[def.property] = 0;
      } else if (def.type === 'array') {
        initialProperties[def.property] = [];
      } else if (def.type === 'truthy') {
        initialProperties[def.property] = false;
      }
      // exactMatch and custom don't need initial properties
    });

    return _setupAchievements(playerIds, initialProperties);
  };

  // Increase function (for counters)
  const increase = (achievements: PlainObject, playerId: string, property: string, value: number): void => {
    _increaseAchievement(achievements, playerId, property, value);
  };

  // Push function (for arrays)
  const push = (achievements: PlainObject, playerId: string, property: string, value: unknown): void => {
    _pushToAchievement(achievements, playerId, property, value);
  };

  // Insert function (for indexed arrays)
  const insert = (
    achievements: PlainObject,
    playerId: string,
    property: string,
    value: unknown,
    index: number,
  ): void => {
    _insertIntoAchievement(achievements, playerId, property, value, index);
  };

  // AddToLast function (for accumulated arrays)
  const addToLast = (achievements: PlainObject, playerId: string, property: string, value: number): void => {
    _addToLastAchievement(achievements, playerId, property, value);
  };

  // SetTruthy function
  const setTruthy = (achievements: PlainObject, playerId: string, property: string): void => {
    if (achievements[playerId]) {
      achievements[playerId][property] = true;
    }
  };

  // Calculate function
  const calculate = (
    achievements: PlainObject,
    exclusions?: Record<string, string[]>,
    players?: Players,
  ): Achievement<string>[] => {
    const results: Achievement<string>[] = [];

    // Validate required exclusions
    const missingExclusions: string[] = [];
    definitions.forEach((def) => {
      if (def.type === 'counter' || def.type === 'array') {
        const config = def.config as CounterConfig | ArrayConfig;
        if (config.requiresExclusions && !exclusions?.[def.property]) {
          missingExclusions.push(def.property);
        }
      } else if (def.type === 'exactMatch') {
        const config = def.config as ExactMatchConfig;
        const propertyToCheck = config.property || def.property;
        if (config.requiresExclusions && !exclusions?.[propertyToCheck]) {
          missingExclusions.push(propertyToCheck);
        }
      }
    });

    if (missingExclusions.length > 0) {
      throw new Error(
        `Missing required exclusions for properties: ${missingExclusions.join(', ')}. ` +
          'These achievements have requiresExclusions: true but no exclusion list was provided in calculate().',
      );
    }

    definitions.forEach((def) => {
      if (def.type === 'counter') {
        const config = def.config as CounterConfig;

        // Run pre-calculate if provided
        if (config.preCalculate && players) {
          config.preCalculate(achievements, players);
        }

        // Get excluded players
        const ineligiblePlayers = exclusions?.[def.property] || [];

        // Combine qualifier and condition if both exist
        let combinedCondition: ((value: number) => boolean) | undefined;
        if (config.qualifier && config.condition) {
          combinedCondition = (v: number) => Boolean(config.qualifier?.(v) && config.condition?.(v));
        } else if (config.qualifier) {
          combinedCondition = config.qualifier;
        } else if (config.condition) {
          combinedCondition = config.condition;
        }

        // Get most and least
        const { most, least } = _getMostAndLeastOf(
          achievements,
          def.property,
          ineligiblePlayers,
          combinedCondition,
        );

        if (most && config.most) {
          results.push({
            type: config.most,
            playerId: most.playerId,
            value: most.value,
          });
        }

        if (least && config.least) {
          results.push({
            type: config.least,
            playerId: least.playerId,
            value: least.value,
          });
        }
      } else if (def.type === 'array') {
        const config = def.config as ArrayConfig;

        // Run pre-calculate if provided
        if (config.preCalculate && players) {
          config.preCalculate(achievements, players);
        }

        // Get excluded players
        const ineligiblePlayers = exclusions?.[def.property] || [];

        // Handle unique
        if (config.unique) {
          const { most, least } = _getMostAndLeastUniqueItemsOf(
            achievements,
            def.property,
            ineligiblePlayers,
            config.qualifier,
          );

          if (most && config.unique.most) {
            results.push({
              type: config.unique.most,
              playerId: most.playerId,
              value: most.value,
            });
          }

          if (least && config.unique.least) {
            results.push({
              type: config.unique.least,
              playerId: least.playerId,
              value: least.value,
            });
          }
        }

        // Handle occurrence
        if (config.occurrence) {
          const { most: latest, least: earliest } = _getEarliestAndLatestOccurrence(
            achievements,
            def.property,
            ineligiblePlayers,
            config.qualifier,
          );

          if (earliest && config.occurrence.earliest) {
            results.push({
              type: config.occurrence.earliest,
              playerId: earliest.playerId,
              value: earliest.value,
            });
          }

          if (latest && config.occurrence.latest) {
            results.push({
              type: config.occurrence.latest,
              playerId: latest.playerId,
              value: latest.value,
            });
          }
        }

        // Handle average
        if (config.average) {
          const { most, least } = _getMostAndLeastOfAverage(
            achievements,
            def.property,
            ineligiblePlayers,
            config.qualifier,
          );

          if (most && config.average.most) {
            results.push({
              type: config.average.most,
              playerId: most.playerId,
              value: most.value,
            });
          }

          if (least && config.average.least) {
            results.push({
              type: config.average.least,
              playerId: least.playerId,
              value: least.value,
            });
          }
        }

        // Handle sum
        if (config.sum) {
          // Apply qualifier to filter array before summing/counting length
          const modifiedAchievements = config.qualifier
            ? Object.values<StoreAchievement>(achievements).reduce((acc, achievement) => {
                const clonedAchievement = { ...achievement };
                clonedAchievement[def.property] = achievement[def.property].filter(config.qualifier);
                acc[achievement.playerId] = clonedAchievement;
                return acc;
              }, {} as PlainObject)
            : achievements;

          const { most, least } = _getMostAndLeastOf(modifiedAchievements, def.property, ineligiblePlayers);

          if (most && config.sum.most) {
            results.push({
              type: config.sum.most,
              playerId: most.playerId,
              value: most.value,
            });
          }

          if (least && config.sum.least) {
            results.push({
              type: config.sum.least,
              playerId: least.playerId,
              value: least.value,
            });
          }
        }

        // Handle extremes (find max/min value in arrays)
        if (config.extremes) {
          const { most, least } = _getHighestAndLowestValues(
            achievements,
            def.property,
            ineligiblePlayers,
            config.qualifier,
          );

          if (most && config.extremes.highest) {
            results.push({
              type: config.extremes.highest,
              playerId: most.playerId,
              value: most.value,
            });
          }

          if (least && config.extremes.lowest) {
            results.push({
              type: config.extremes.lowest,
              playerId: least.playerId,
              value: least.value,
            });
          }
        }

        // Handle run (longest/shortest consecutive streak)
        if (config.run) {
          const modifiedAchievements = Object.values<StoreAchievement>(achievements).reduce(
            (acc, achievement) => {
              const clonedAchievement = { ...achievement };
              if (config.run) {
                const values = config.qualifier
                  ? achievement[def.property].filter(config.qualifier)
                  : achievement[def.property];
                clonedAchievement[def.property] = _calculateLongestRun(values, config.run.value);
              }
              acc[achievement.playerId] = clonedAchievement;
              return acc;
            },
            {} as PlainObject,
          );

          const { most, least } = _getMostAndLeastOf(
            modifiedAchievements,
            def.property,
            ineligiblePlayers,
            (v) => v > 0,
          );

          if (most && config.run.longest) {
            results.push({
              type: config.run.longest,
              playerId: most.playerId,
              value: most.value,
            });
          }

          if (least && config.run.shortest) {
            results.push({
              type: config.run.shortest,
              playerId: least.playerId,
              value: least.value,
            });
          }
        }
      } else if (def.type === 'exactMatch') {
        const config = def.config as ExactMatchConfig;
        const propertyToCheck = config.property || def.property;

        // Get excluded players
        const ineligiblePlayers = exclusions?.[propertyToCheck] || [];

        // Determine the primary type of this property (if it's shared with another definition)
        const primaryTypeDef = definitions.find(
          (d) => d.property === propertyToCheck && d.type !== 'exactMatch',
        );
        const propertyType = primaryTypeDef?.type as 'counter' | 'array' | 'truthy' | undefined;

        const match = _getOnlyExactMatch(
          achievements,
          propertyToCheck,
          config.value,
          ineligiblePlayers,
          propertyType,
        );

        if (match) {
          results.push({
            type: config.key,
            playerId: match.playerId,
            value: match.value,
          });
        }
      } else if (def.type === 'truthy') {
        const config = def.config as TruthyConfig;

        const truthyPlayers = _getPlayersWithTruthyAchievement(achievements, def.property);

        truthyPlayers.forEach((playerId) => {
          results.push({
            type: config.key,
            playerId,
            value: 1,
          });
        });
      } else if (def.type === 'custom') {
        const config = def.config as CustomConfig;
        if (players) {
          const customResults = config.calculate(achievements, players);
          results.push(...customResults);
        }
      }
    });

    return results;
  };

  // Return utilities with types
  return {
    constants: constants as GenerateConstants<TDefinitions>,
    AchievementType: '' as TDefinitions[number] extends { config: infer C }
      ? C extends { most: string }
        ? C['most']
        : C extends { least: string }
          ? C['least']
          : C extends { key: string }
            ? C['key']
            : C extends { achievements: string[] }
              ? C['achievements'][number]
              : never
      : never,
    setup,
    increase: increase as <P extends CounterProperties<TDefinitions>>(
      achievements: PlainObject,
      playerId: string,
      property: P,
      value: number,
    ) => void,
    push: push as <P extends ArrayProperties<TDefinitions>>(
      achievements: PlainObject,
      playerId: string,
      property: P,
      value: unknown,
    ) => void,
    insert: insert as <P extends ArrayProperties<TDefinitions>>(
      achievements: PlainObject,
      playerId: string,
      property: P,
      value: unknown,
      index: number,
    ) => void,
    addToLast: addToLast as <P extends ArrayProperties<TDefinitions>>(
      achievements: PlainObject,
      playerId: string,
      property: P,
      value: number,
    ) => void,
    setTruthy: setTruthy as <P extends TruthyProperties<TDefinitions>>(
      achievements: PlainObject,
      playerId: string,
      property: P,
    ) => void,
    calculate,
  };
}

// ========================================
// EXPORT
// ========================================

/**
 * Create a new achievement builder for a game
 * @param gamePrefix - Game name prefix (e.g., 'ADEDANHX')
 * @returns Achievement builder instance
 */
export function achievementBuilder(gamePrefix: string) {
  return new AchievementBuilderClass(gamePrefix);
}

export const achievementToolkit = {
  achievementBuilder,
};
