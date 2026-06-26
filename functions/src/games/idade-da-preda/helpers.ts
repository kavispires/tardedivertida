import { orderBy, shuffle } from 'lodash';
// Types
import type { ConceptData, FirebaseStoreData, GalleryEntry, NewNameEntry } from './types';
// Constants
import { IDADE_DA_PREDA_PHASES, SOUNDS } from './constants';
// Mechanics
import { getListOfPlayers } from '../../mechanics/players';
import { Scores } from '../../mechanics/scoring';
import { nextPhaseDelegator } from '../../mechanics/session';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (
  currentPhase: keyof typeof IDADE_DA_PREDA_PHASES,
  round: Round,
): string => {
  const { SETUP, CREATING_CONCEPTS, CONCEPTS_REVEAL, COMMUNICATING_THINGS, GUESSING, RESULTS, GAME_OVER } =
    IDADE_DA_PREDA_PHASES;
  const order = [
    SETUP,
    CREATING_CONCEPTS,
    CONCEPTS_REVEAL,
    COMMUNICATING_THINGS,
    GUESSING,
    RESULTS,
    GAME_OVER,
  ];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : CREATING_CONCEPTS;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Gathers all concepts proposed by players and tracks sound usage
 * @param players - The collection of players in the game
 * @param store - The Firebase store data for tracking achievements
 */
export const gatherConcepts = (players: Players, store: FirebaseStoreData): ConceptData[] => {
  const allConcepts: ConceptData[] = [];

  getListOfPlayers(players).forEach((player) => {
    if (player.proposedConcepts) {
      allConcepts.push(...player.proposedConcepts);
    }
  });

  const usedSounds: Dictionary<boolean> = {};
  allConcepts.forEach((concept) => {
    if (concept.soundId) {
      usedSounds[concept.soundId] = true;
    }
  });

  // Get all unused sounds
  const unusedSounds = shuffle(Object.keys(SOUNDS).filter((soundId) => !usedSounds[soundId]));

  allConcepts.forEach((concept) => {
    if (!concept.soundId && unusedSounds.length > 0) {
      concept.type = 'custom';
      // Assign a random unused sound to the concept
      concept.soundId = unusedSounds.pop() || '0';
      concept.syllable = SOUNDS[concept.soundId];
      // Achievement: Items in concept
      // utils.achievements.increase(store, concept.playerId, 'conceptItems', concept.itemsIds.length);
      // Achievement: Concepts created
      // utils.achievements.increase(store, concept.playerId, 'concepts', 1);
    }
  });

  // Create keys
  allConcepts.forEach((concept) => {
    concept.key = orderBy(concept.itemsIds, (id) => id).join('-');
  });

  return allConcepts;
};

/**
 * Builds gallery and player rankings based on naming guesses
 * @param newNames - The array of new name entries submitted by players
 * @param players - The collection of players in the game
 * @param store - The Firebase store data for tracking achievements
 */
export const buildGalleryAndRanking = (
  newNames: NewNameEntry[],
  players: Players,
  store: FirebaseStoreData,
) => {
  // Gained Points [correct guesses, guesses on your drawing]
  const scores = new Scores(players, [0, 0]);
  const gallery: GalleryEntry[] = [];

  const playerCount = getListOfPlayers(players).length;

  newNames.forEach((nameEntry) => {
    const creatorId = nameEntry.playerId;
    const galleryEntry: GalleryEntry = {
      id: nameEntry.id,
      itemId: nameEntry.itemId,
      name: nameEntry.name,
      playerId: creatorId,
      conceptsIds: nameEntry.conceptsIds,
      correctPlayersIds: [],
      guesses: {},
    };

    getListOfPlayers(players).forEach((player) => {
      if (!creatorId || creatorId === player.id) return;

      // Calculate player points
      if (player.guesses[creatorId] === nameEntry.itemId) {
        scores.add(player.id, 2, 0);
        scores.add(creatorId, 1, 1);
        galleryEntry.correctPlayersIds.push(player.id);
      }

      const selectedItemId = player.guesses[creatorId];
      if (galleryEntry.guesses[selectedItemId] === undefined) {
        galleryEntry.guesses[selectedItemId] = [];
      }

      galleryEntry.guesses[selectedItemId].push(player.id);
    });
    // Achievement: Name length
    // utils.achievements.increase(store, creatorId, 'nameLength', nameEntry.name.length);
    // Achievement: Name quality
    // utils.achievements.increase(store, creatorId, 'nameQuality', galleryEntry.correctPlayersIds.length);

    // Achievement: Distinct name (only one guesser)
    if (galleryEntry.correctPlayersIds.length === 1) {
      // utils.achievements.increase(store, creatorId, 'distinctNames', 1);
    }

    // Achievement: Everybody guessed
    if (galleryEntry.correctPlayersIds.length === playerCount - 1) {
      // utils.achievements.increase(store, creatorId, 'commonKnowledge', 1);
    }

    gallery.push(galleryEntry);
  });

  return {
    ranking: scores.rank(players),
    gallery: orderBy(gallery, ['name'], ['asc']),
  };
};
