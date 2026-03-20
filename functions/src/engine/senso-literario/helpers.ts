import {
  BONUS_POINT_FOR_SET,
  COLORS,
  GENRES,
  LETTERS,
  POINTS_PER_GUESS,
  SENSO_LITERARIO_ACHIEVEMENTS,
  SENSO_LITERARIO_PHASES,
} from './constants';
// Utils
import utils from '../../utils';
import { orderBy, shuffle } from 'lodash';
import type { FirebaseStoreData, GalleryEntry, SensoLiterarioAchievement } from './types';
/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, PATTERN_CREATION, RESULT, GAME_OVER } = SENSO_LITERARIO_PHASES;
  const order = [LOBBY, SETUP, PATTERN_CREATION, RESULT, GAME_OVER];

  if (currentPhase === RESULT) {
    if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
      return GAME_OVER;
    }

    return PATTERN_CREATION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return PATTERN_CREATION;
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
      LETTERS.forEach((letter) => {
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

export function buildRanking(store: FirebaseStoreData, players: Players, sequence: UID[]) {
  // Gained Points: [each part match, bonus for all match]
  const scores = new utils.players.Scores(players, [0, 0]);

  const gallery: GalleryEntry = {
    sequence,
    cards: [],
  };

  const patternIdDictionary: Dictionary<UID[]> = {};
  const partsDictionary: Dictionary<UID[]> = {};

  utils.players.getListOfPlayers(players).forEach((player) => {
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
          playersIsd: [],
        };
        gallery.cards.push(entry);
      }
      entry.playersIsd.push(player.id);
    } else {
      gallery.cards.push({
        patternId,
        playersIsd: [player.id],
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
        utils.achievements.increase(store, playerId, 'fullMatches', 1);
      });
    }
  });

  Object.entries(partsDictionary).forEach(([part, playerIds]) => {
    if (playerIds.length > 1) {
      // Some matched this part
      playerIds.forEach((playerId) => {
        gotMatches[playerId] = true;
        scores.add(playerId, POINTS_PER_GUESS, 0);
        // Achievement for part use
        utils.achievements.increase(store, playerId, part, 1);
      });
    } else {
      // Achievement for part use
      utils.achievements.increase(store, playerIds[0], part, 1);
    }
  });

  // Achievement: No full matches
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (!gotMatches[player.id]) {
      utils.achievements.increase(store, player.id, 'noMatches', 1);
    }
  });

  gallery.cards = orderBy(gallery.cards, [(card) => card.playersIsd.length, 'patternId'], ['desc', 'asc']);

  return {
    gallery,
    ranking: scores.rank(players),
  };
}

/**
 * Get achievements for Senso Literario
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<SensoLiterarioAchievement>[] = [];

  // Most Children's Books Matches
  const { most: childrensBooks } = utils.achievements.getMostAndLeastOf(store, 'childrens');
  if (childrensBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_CHILDRENS_BOOKS_MATCHES,
      playerId: childrensBooks.playerId,
      value: childrensBooks.value,
    });
  }

  // Most Romance Books Matches
  const { most: romanceBooks } = utils.achievements.getMostAndLeastOf(store, 'romance');
  if (romanceBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_ROMANCE_BOOKS_MATCHES,
      playerId: romanceBooks.playerId,
      value: romanceBooks.value,
    });
  }

  // Most Technical Books Matches
  const { most: technicalBooks } = utils.achievements.getMostAndLeastOf(store, 'technical');
  if (technicalBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_TECHNICAL_BOOKS_MATCHES,
      playerId: technicalBooks.playerId,
      value: technicalBooks.value,
    });
  }

  // Most Red Books Matches
  const { most: redBooks } = utils.achievements.getMostAndLeastOf(store, 'red');
  if (redBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_RED_BOOKS_MATCHES,
      playerId: redBooks.playerId,
      value: redBooks.value,
    });
  }

  // Most Blue Books Matches
  const { most: blueBooks } = utils.achievements.getMostAndLeastOf(store, 'blue');
  if (blueBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_BLUE_BOOKS_MATCHES,
      playerId: blueBooks.playerId,
      value: blueBooks.value,
    });
  }

  // Most Yellow Books Matches
  const { most: yellowBooks } = utils.achievements.getMostAndLeastOf(store, 'yellow');
  if (yellowBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_YELLOW_BOOKS_MATCHES,
      playerId: yellowBooks.playerId,
      value: yellowBooks.value,
    });
  }

  // Most Letter A Books Matches
  const { most: letterABooks } = utils.achievements.getMostAndLeastOf(store, 'A');
  if (letterABooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_LETTER_A_BOOKS_MATCHES,
      playerId: letterABooks.playerId,
      value: letterABooks.value,
    });
  }

  // Most Letter B Books Matches
  const { most: letterBBooks } = utils.achievements.getMostAndLeastOf(store, 'B');
  if (letterBBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_LETTER_B_BOOKS_MATCHES,
      playerId: letterBBooks.playerId,
      value: letterBBooks.value,
    });
  }

  // Most Letter C Books Matches
  const { most: letterCBooks } = utils.achievements.getMostAndLeastOf(store, 'C');
  if (letterCBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_LETTER_C_BOOKS_MATCHES,
      playerId: letterCBooks.playerId,
      value: letterCBooks.value,
    });
  }

  // Most Letter D Books Matches
  const { most: letterDBooks } = utils.achievements.getMostAndLeastOf(store, 'D');
  if (letterDBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_LETTER_D_BOOKS_MATCHES,
      playerId: letterDBooks.playerId,
      value: letterDBooks.value,
    });
  }

  // Most Letter E Books Matches
  const { most: letterEBooks } = utils.achievements.getMostAndLeastOf(store, 'E');
  if (letterEBooks) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_LETTER_E_BOOKS_MATCHES,
      playerId: letterEBooks.playerId,
      value: letterEBooks.value,
    });
  }

  // Most No Matches
  const { most: noMatches } = utils.achievements.getMostAndLeastOf(store, 'noMatches');
  if (noMatches) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_NO_MATCHES,
      playerId: noMatches.playerId,
      value: noMatches.value,
    });
  }

  // Most Full Matches
  const { most: fullMatches } = utils.achievements.getMostAndLeastOf(store, 'fullMatches');
  if (fullMatches) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.MOST_FULL_MATCHES,
      playerId: fullMatches.playerId,
      value: fullMatches.value,
    });
  }

  // Fewest Full Matches
  const { least: fewestFullMatches } = utils.achievements.getMostAndLeastOf(store, 'fullMatches');
  if (fewestFullMatches) {
    achievements.push({
      type: SENSO_LITERARIO_ACHIEVEMENTS.FEWEST_FULL_MATCHES,
      playerId: fewestFullMatches.playerId,
      value: fewestFullMatches.value,
    });
  }

  return achievements;
};
