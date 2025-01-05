# Achievement Utils

This document provides an overview of the functions available in `achievement-utils.ts` and instructions on how to use them effectively.

## Overview

The `achievement-utils.ts` file contains utility functions to manage and calculate achievements for players in the game. These functions help set up, update, and retrieve achievements from the store.

## Functions

### `setup(players: Players, store: PlainObject, properties: PlainObject)`

Sets up achievements in the store by creating an achievements object for every player with the given starting properties.

**Parameters:**
- `players`: The list of players.
- `store`: The achievement store.
- `properties`: The initial properties for each player's achievements.

**Returns:**
- The updated achievements object.

### `increase(store: PlainObject, playerId: PlayerId, property: string, value: number)`

Adds a numeric value to a given property in the achievements.

**Parameters:**
- `store`: The achievement store.
- `playerId`: The ID of the player.
- `property`: The property to increase.
- `value`: The value to increase.

**Returns:**
- The updated achievements object.

### `push(store: PlainObject, playerId: PlayerId, property: string, value: any)`

Pushes a value to the achievements property array.

**Parameters:**
- `store`: The achievement store.
- `playerId`: The ID of the player.
- `property`: The property to which the value is added.
- `value`: The value to add.

**Returns:**
- The updated achievements object.

### `insert(store: PlainObject, playerId: PlayerId, property: string, value: any, index: number)`

Inserts a value in a specific array index in the achievements.

**Parameters:**
- `store`: The achievement store.
- `playerId`: The ID of the player.
- `property`: The property to which the value is added.
- `value`: The value to add.
- `index`: The index at which to insert the value.

**Returns:**
- The updated achievements object.

### `getMostAndLeastOf(store: PlainObject, property: string, ineligiblePlayers: PlayerId[], condition: (args: any) => boolean)`

Gets the most and least values of a certain property, excluding ineligible players and based on a condition.

**Parameters:**
- `store`: The achievement store.
- `property`: The property to evaluate.
- `ineligiblePlayers`: Player IDs that should not count for the achievement.
- `condition`: Function to verify the value (e.g., if it's positive).

**Returns:**
- An object with `most` and `least` values.

### `getMostAndLeastOfAverage(store: PlainObject, property: string, ineligiblePlayers: PlayerId[])`

Gets the most and least values of a certain property based on the average of the array of values.

**Parameters:**
- `store`: The achievement store.
- `property`: The property to evaluate.
- `ineligiblePlayers`: Player IDs that should not count for the achievement.

**Returns:**
- An object with `most` and `least` values.

### `getMostAndLeastUniqueItemsOf(store: PlainObject, property: string, ineligiblePlayers: PlayerId[])`

Gets the most and least unique items of a certain property.

**Parameters:**
- `store`: The achievement store.
- `property`: The property to evaluate.
- `ineligiblePlayers`: Player IDs that should not count for the achievement.

**Returns:**
- An object with `most` and `least` values.

### `getEarliestAndLatestOccurrence(store: PlainObject, property: string, ineligiblePlayers: PlayerId[])`

Gets the earliest and latest occurrences of a certain property.

**Parameters:**
- `store`: The achievement store.
- `property`: The property to evaluate.
- `ineligiblePlayers`: Player IDs that should not count for the achievement.

**Returns:**
- An object with `most` and `least` values.

### `getOnlyExactMatch(store: PlainObject, property: string, value: any, ineligiblePlayers: PlayerId[])`

Gets the only exact match of a certain property and value.

**Parameters:**
- `store`: The achievement store.
- `property`: The property to evaluate.
- `value`: The value to match.
- `ineligiblePlayers`: Player IDs that should not count for the achievement.

**Returns:**
- A `ResultAchievement` object if there is an exact match, otherwise `null`.

## Usage

To use these utility functions, import them into your game engine or related modules and call them with the appropriate parameters. These functions help manage the achievements for players efficiently and can be used to track various metrics and milestones in the game.

Example:

```typescript
import { setup, increase, getMostAndLeastOf } from './achievement-utils';

// Set up achievements for players
const achievements = setup(players, store, initialProperties);

// Increase a property value for a player
increase(store, playerId, 'score', 10);

// Get the most and least scores
const result = getMostAndLeastOf(store, 'score', []);
```

Use these functions to manage and calculate player achievements as needed in your game logic.
