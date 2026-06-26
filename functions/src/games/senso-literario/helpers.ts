import { orderBy, shuffle } from 'lodash';
// Types
import type { FirebaseStoreData, GalleryEntry } from './types';
// Constants
import {
  BONUS_POINT_FOR_SET,
  COLORS,
  GENRES,
  BOOK_INITIALS,
  POINTS_PER_GUESS,
  SENSO_LITERARIO_PHASES,
} from './constants';
// Mechanics
import { getListOfPlayers } from '../../mechanics/players';
import { Scores } from '../../mechanics/scoring';
import { nextPhaseDelegator } from '../../mechanics/session';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, PATTERN_CREATION, RESULT, GAME_OVER } = SENSO_LITERARIO_PHASES;
  const order = [SETUP, PATTERN_CREATION, RESULT, GAME_OVER];

  if (currentPhase === RESULT) {
    if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
      return GAME_OVER;
    }

    return PATTERN_CREATION;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds and shuffles a deck of cards by combining all possible permutations of colors, genres, and letters.
 * Each card ID is formatted as `${color}-${genre}-${letter}`.
 * @returns A shuffled array of card IDs representing the complete deck
 */
export function buildDeck() {
  const deck: UID[] = [];
  COLORS.forEach((color) => {
    GENRES.forEach((genre) => {
      BOOK_INITIALS.forEach((letter) => {
        deck.push(`${color}-${genre}-${letter}`);
      });
    });
  });

  return shuffle(deck);
}

/**
 * Builds and shuffles a sequence of cards for a specific round in the Senso Literário game.
 *
 * The function selects 4 cards from the deck based on the current round number,
 * adds a wildcard to the sequence, and returns a shuffled version of the combined cards.
 *
 * @param deck - An array of card IDs representing the complete deck of cards
 * @param currentRound - The current round number (1-indexed) used to determine which cards to select
 * @returns A shuffled array containing 4 round-specific cards plus one wildcard
 */
export function buildSequence(deck: UID[], currentRound: number) {
  const sequence: UID[] = [];
  // Get 4 cards for the sequence (it should get a chunk from the deck based on the round)
  const cardsInRound = currentRound < 4 ? 4 : 5;
  const startIndex = (currentRound - 1) * cardsInRound;
  const endIndex = startIndex + cardsInRound;
  const roundCards = deck.slice(startIndex, endIndex);
  sequence.push(...roundCards);

  // Add the wildcard
  sequence.push('wildcard');

  // Shuffle the sequence
  return shuffle(sequence);
}

/**
 * Builds player rankings and gallery based on pattern matching
 * @param store - The Firebase store data for tracking achievements
 * @param players - The collection of players in the game
 * @param sequence - The array of card IDs in the current sequence
 */
export function buildRanking(store: FirebaseStoreData, players: Players, sequence: UID[]) {
  // Gained Points: [each part match, bonus for all match]
  const scores = new Scores(players, [0, 0]);

  const gallery: GalleryEntry = {
    sequence,
    cards: [],
  };

  const patternIdDictionary: Dictionary<UID[]> = {};
  const partsDictionary: Dictionary<UID[]> = {};

  getListOfPlayers(players).forEach((player) => {
    const patternId = player.patternId as string;
    if (!patternIdDictionary[patternId]) {
      patternIdDictionary[patternId] = [];
    }
    patternIdDictionary[patternId].push(player.id);
    if (patternIdDictionary[patternId]) {
      // Find the entry with the same patternId
      let entry = gallery.cards.find((card) => card.patternId === patternId);
      if (!entry) {
        entry = {
          patternId,
          playersIds: [],
        };
        gallery.cards.push(entry);
      }
      entry.playersIds.push(player.id);
    } else {
      gallery.cards.push({
        patternId,
        playersIds: [player.id],
      });
    }

    const parts = patternId.split('-');
    parts.forEach((part) => {
      if (!partsDictionary[part]) {
        partsDictionary[part] = [];
      }
      partsDictionary[part].push(player.id);
    });
  });

  const gotMatches: Dictionary<boolean> = {};

  Object.values(patternIdDictionary).forEach((playerIds) => {
    if (playerIds.length > 1) {
      // All matched the pattern
      playerIds.forEach((playerId) => {
        gotMatches[playerId] = true;
        scores.add(playerId, BONUS_POINT_FOR_SET, 1);
        // Achievement for full matches
        increaseAchievement(store.achievements, playerId, 'fullMatches', 1);
      });
    }
  });

  Object.entries(partsDictionary).forEach(([part, playerIds]) => {
    const achievementKey = part as
      | 'childrens'
      | 'romance'
      | 'technical'
      | 'blue'
      | 'yellow'
      | 'red'
      | 'A'
      | 'B'
      | 'C'
      | 'D'
      | 'E';
    if (playerIds.length > 1) {
      // Some matched this part
      playerIds.forEach((playerId) => {
        gotMatches[playerId] = true;
        scores.add(playerId, POINTS_PER_GUESS, 0);
        // Achievement for part use
        increaseAchievement(store.achievements, playerId, achievementKey, 1);
      });
    } else {
      // Achievement for part use
      increaseAchievement(store.achievements, playerIds[0], achievementKey, 1);
    }
  });

  // Achievement: No full matches
  getListOfPlayers(players).forEach((player) => {
    if (!gotMatches[player.id]) {
      increaseAchievement(store.achievements, player.id, 'noMatches', 1);
    }
  });

  gallery.cards = orderBy(gallery.cards, [(card) => card.playersIds.length, 'patternId'], ['desc', 'asc']);

  return {
    gallery,
    ranking: scores.rank(players),
  };
}
