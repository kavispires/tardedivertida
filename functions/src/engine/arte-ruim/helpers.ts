// Types
import type { ArteRuimCard, ArteRuimGroup, ArteRuimPair } from '../../types/tdr';
import { sampleSize, shuffle } from 'lodash';
import type {
  ArteRuimDrawing,
  FirebaseStoreData,
  CardsByLevel,
  ResourceData,
  ArteRuimGameOptions,
} from './types';
// Constants
import { ARTE_RUIM_PHASES, GAME_OVER_SCORE_THRESHOLD, DEFAULT_LEVELS, BASIC_LEVELS } from './constants';
// Helpers
import utils from '../../utils';
import { increaseAchievement } from './achievements';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { SETUP, DRAW, EVALUATION, GALLERY, GAME_OVER } = ARTE_RUIM_PHASES;
  const order = [SETUP, DRAW, EVALUATION, GALLERY, GAME_OVER];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === GALLERY) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : DRAW;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Determine if a player has passed max points and it should be game over
 * @param players
 * @returns
 */
export const determineGameOver = (players: Players, round: Round): boolean => {
  // In a short game, the points threshold doesn't count
  if (round.total === 5) return false;

  const playerCount = utils.players.getPlayerCount(players);
  const threshold = GAME_OVER_SCORE_THRESHOLD?.[playerCount] ?? 100;
  return utils.players.getListOfPlayers(players).some((player) => player.score >= threshold);
};

/**
 * Get game settings
 * @param isShortGame
 * @returns
 */
export const getGameSettings = (options: ArteRuimGameOptions) => {
  const levelsReference = options.basicLevelsOnly ? BASIC_LEVELS : DEFAULT_LEVELS;
  const levels = options.forPoints ? [...levelsReference, ...levelsReference] : levelsReference;

  return {
    MAX_ROUNDS: levels.length,
    LEVELS: options.randomize ? shuffle(levels) : levels,
  };
};

/**
 * Split cards into respective levels
 * @param cards
 * @returns
 */
export const distributeCardsByLevel = (cards: ArteRuimCard[]): CardsByLevel => {
  const cardsPerLevel: CardsByLevel = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  };

  // Split in levels
  Object.values(cards).forEach((entry: ArteRuimCard) => {
    cardsPerLevel[entry.level].push(entry);
  });

  return cardsPerLevel;
};

/**
 * Gets available cards by level, filtering out used cards, and determines if reset is needed
 * @param cardsByLevel - Cards organized by level
 * @param usedCardsIds - Dictionary of used card IDs
 * @param roundLevels - Array of levels for each round
 * @param playerCount - Number of players
 */
export const getAvailableCards = (
  cardsByLevel: CardsByLevel,
  usedCardsIds: Dictionary<boolean>,
  roundLevels: number[],
  playerCount: number,
): {
  cards: CardsByLevel;
  resetUsedCards: boolean;
} => {
  const cardsNeeded: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
  };

  // Count cards needed by level
  for (const level in cardsByLevel) {
    const levelNum = Number(level);
    if (levelNum > 0 && levelNum < 4) {
      cardsNeeded[levelNum] =
        determineNumberOfCards(playerCount) * roundLevels.filter((l) => l === levelNum).length;
    }
  }

  const availableCards: CardsByLevel = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  };

  // Filter only available
  for (const level in cardsNeeded) {
    for (const cardId in cardsByLevel[level]) {
      if (usedCardsIds[cardId] === undefined) {
        availableCards[level].push(cardsByLevel[level][cardId]);
      }
    }
  }

  let hasEnough = true;
  // Verify count
  for (const level in cardsNeeded) {
    if (availableCards[level].length < cardsNeeded[level]) {
      hasEnough = false;
    }
  }

  return {
    cards: hasEnough ? availableCards : cardsByLevel,
    resetUsedCards: !hasEnough,
  };
};

/**
 * Get enough level 5 cards
 * @param deck
 * @param usedCards
 * @param cardsNeeded
 * @returns
 */
export const getEnoughUnusedLevel5Cards = (
  deck: ArteRuimGroup[],
  usedCards: PlainObject,
  cardsNeeded: number,
): string[] => {
  let tries = 0;
  const discarded: string[] = [];
  const reserved: PlainObject = [];

  while (Object.keys(reserved).length < cardsNeeded) {
    // Makes sure the look is not infinite
    tries++;
    if (tries > 100) {
      return utils.helpers.sliceIntoChunks(discarded, cardsNeeded)[0];
    }
    const selected = deck.pop();
    if (selected) {
      const cards = Object.keys(selected.cards);
      // Check if any has been used
      if (cards.some((cardId) => usedCards[cardId]) && cards.some((cardId) => reserved[cardId])) {
        cards.forEach((cardId) => {
          discarded.push(cardId);
        });
      } else {
        cards.forEach((cardId) => {
          reserved[cardId] = true;
        });
      }
    }
  }

  return shuffle(Object.keys(reserved)).slice(0, cardsNeeded);
};

/**
 * Builds the deck as evenly as possible with cards needed per level
 * @param resourceData
 * @param playerCount
 * @param isShortGame
 * @returns
 */
export const buildDeck = (
  resourceData: ResourceData,
  playerCount: number,
  levels: number[],
): ArteRuimCard[] => {
  const cardsPerRound = determineNumberOfCards(playerCount);
  const cardsNeeded = levels.length * cardsPerRound;

  const { allCards, availableCards, cardsGroups, specialLevels } = resourceData;

  // Shuffle available decls
  availableCards[1] = shuffle(availableCards[1]);
  availableCards[2] = shuffle(availableCards[2]);
  availableCards[3] = shuffle(availableCards[3]);

  const usedCardIdDict = {};
  const shuffledLevel5Deck = shuffle(cardsGroups);
  let level5Hand: UID[] = [];

  return Array(cardsNeeded)
    .fill(0)
    .map((e, i) => {
      const level = levels[Math.floor((e + i) / cardsPerRound)];

      // Level 4 (pairs or special levels)
      if (level === 4 && specialLevels) {
        const card = specialLevels.cards.pop();
        if (card) {
          return card;
        }
      }
      // Level 5 (cards within a common theme)
      else if (level === 5) {
        // When no level 5 cards are available, fetch a new hand with the minimum needed for a round
        if (level5Hand.length === 0) {
          level5Hand = getEnoughUnusedLevel5Cards(shuffledLevel5Deck, usedCardIdDict, cardsPerRound);
        }
        const cardId = level5Hand.pop();
        if (cardId) {
          return {
            ...allCards[cardId],
            level: 5,
          };
        }
      } else {
        const card = availableCards[level].pop();
        if (card) {
          usedCardIdDict[card.id] = true;
          return card;
        }
      }

      return {
        id: '0',
        text: 'error',
        level: 1,
      };
    })
    .reverse();
};

/**
 * Gets enough level 4 cards for all players by creating duplicates from pairs
 * @param cards - Array of level 4 card pairs
 * @param playerCount - Number of players
 */
export const getEnoughLevel4Cards = (cards: ArteRuimPair[], playerCount: number) => {
  let result: ArteRuimCard[] = [];

  function buildNecessaryArray(card: ArteRuimPair, count: number): ArteRuimCard[] {
    const newCards: ArteRuimCard[] = card.values.map((value, index) => ({
      id: `${card.id}--${index}`,
      text: value,
      level: 4,
    }));

    const cardsArr0 = new Array(count * 2).fill(newCards[0]).map((c, i) => ({ ...c, id: `${c.id}--${i}` }));
    const cardsArr1 = new Array(count * 2).fill(newCards[1]).map((c, i) => ({ ...c, id: `${c.id}--${i}` }));
    // From an array composed of twice the numbers of players for each card,
    // return an array with the exact number of players
    const randomCards = sampleSize([...cardsArr0, ...cardsArr1], count - 2);
    // Guarantee that there's at least one of each
    return sampleSize([newCards[0], newCards[1], ...randomCards], count);
  }

  // Get 2 pairs
  [cards[0], cards[1]].forEach((card) => {
    result = result.concat(buildNecessaryArray(card, playerCount));
  });

  return result;
};

/**
 * Returns a unique set of cards for pairs level
 * @param cards - Array of cards to filter for uniqueness
 */
export const getTwoUniquePairCards = (cards: ArteRuimCard[]): ArteRuimCard[] => {
  const cache: Dictionary<boolean> = {};

  const selectedCards = cards.filter((card) => {
    if (cache[card.text] === undefined) {
      cache[card.text] = true;
      return true;
    }
    return false;
  });

  return selectedCards.map((card) => ({
    ...card,
    id: getPairCardId(card.id),
  }));
};

/**
 * Determine the number of cards in a round
 * @param playerCount
 * @returns
 */
export const determineNumberOfCards = (playerCount: number): number => {
  if (playerCount < 5) {
    return 7;
  }
  return playerCount + 2;
};

/**
 * Deal cards for the current round
 * @param players - it modifies players
 * @param store - it modifies store
 */
export const dealCards = (players: Players, store: FirebaseStoreData) => {
  const playersArray = utils.players.getListOfPlayers(players);
  const numberOfCards = determineNumberOfCards(playersArray.length);

  store.currentCards = new Array(numberOfCards).fill(0).map((i, index) => {
    const currentPlayerId = playersArray?.[index]?.id ?? null;
    const card: ArteRuimDrawing = {
      ...(store.deck.pop() as ArteRuimCard),
      drawing: null,
      successRate: i,
      playerId: currentPlayerId,
    };

    if (currentPlayerId) {
      players[currentPlayerId].currentCard = card;
    }

    return card;
  });
};

const getPairCardId = (id: string): string => {
  const split = id.split('--');
  return split.length === 1 ? id : `${split[0]}--${split[1]}`;
};

/**
 * Build gallery
 * @param drawings
 * @param players
 * @returns
 */
export const buildGallery = (
  drawings: ArteRuimDrawing[],
  players: Players,
  store: PlainObject,
  tableCardsIds: UID[],
) =>
  drawings.map((drawingEntry) => {
    const playerCount = utils.players.getPlayerCount(players);
    const correctAnswer = getPairCardId(drawingEntry.id);
    const artistId = drawingEntry.playerId;

    const newGalleryEntry = {
      id: correctAnswer,
      originalId: drawingEntry.id,
      drawing: drawingEntry.drawing,
      artistId,
      level: drawingEntry.level,
      text: drawingEntry.text,
      playersSay: {},
      playersPoints: {},
      accuracy: 0,
    };

    const playersSay = {};
    const playersPoints = {};
    const gotCorrect: UID[] = [];
    const gotWrong: UID[] = [];

    Object.entries(<PlainObject>players).forEach(([playerId, pObject]) => {
      if (artistId === playerId) {
        if (pObject.choseRandomly) {
          increaseAchievement(store.achievements, playerId, 'chooseForMe', 1);
        }
        return;
      }

      if (artistId) {
        // Calculate what players say
        const currentVote = getPairCardId(pObject.votes[drawingEntry.id]);

        const peopleSayId = currentVote;

        if (playersSay[peopleSayId] === undefined) {
          playersSay[peopleSayId] = [];
        }

        playersSay[peopleSayId].push(playerId);

        // Calculate player points
        if (playersPoints[playerId] === undefined) {
          playersPoints[playerId] = 0;
        }
        if (playersPoints?.[artistId] === undefined) {
          playersPoints[artistId] = 0;
        }

        if (currentVote === correctAnswer) {
          playersPoints[playerId] += 2;
          playersPoints[artistId] += 1;
          gotCorrect.push(playerId);
        } else {
          gotWrong.push(playerId);
        }

        // Achievement: tableVotes
        if (drawingEntry.level < 4 && tableCardsIds.includes(currentVote)) {
          increaseAchievement(store.achievements, playerId, 'tableVotes', 1);
        }
      }
    });
    newGalleryEntry.playersSay = playersSay;
    newGalleryEntry.playersPoints = playersPoints;
    newGalleryEntry.accuracy = (1 * gotCorrect.length) / (newGalleryEntry.level * (playerCount - 1));

    // Achievement: artistPoints
    if (gotCorrect.length === playerCount - 1 && artistId) {
      increaseAchievement(store.achievements, artistId, 'artistPoints', drawingEntry.level);
    }

    // Achievement: worstArtist
    if (gotCorrect.length === 0 && artistId) {
      increaseAchievement(store.achievements, artistId, 'worstArtist', 6 - drawingEntry.level);
    }

    // Achievement: solitaryWin
    if (gotCorrect.length === 1) {
      increaseAchievement(store.achievements, gotCorrect[0], 'solitaryWin', 1);
    }

    // Achievement: solitaryFail
    if (gotWrong.length === 1) {
      increaseAchievement(store.achievements, gotWrong[0], 'solitaryFail', 1);
    }

    return newGalleryEntry;
  });

/**
 * Build round ranking
 * @param drawings
 * @param players
 * @returns
 */
export const buildRanking = (drawings: ArteRuimDrawing[], players: Players) => {
  // Gained Points [correct guesses, guesses on your drawing]
  const scores = new utils.players.Scores(players, [0, 0]);

  drawings.forEach((drawingEntry) => {
    const correctAnswer = getPairCardId(drawingEntry.id);
    const artistId = drawingEntry.playerId;

    utils.players.getListOfPlayers(players).forEach((player) => {
      if (artistId === player.id) return;

      if (artistId) {
        // Calculate what players say
        const currentVote = getPairCardId(player.votes[drawingEntry.id]);

        // Calculate player points
        if (currentVote === correctAnswer) {
          scores.add(player.id, 2, 0);
          scores.add(artistId, 1, 1);
        }
      }
    });
  });

  return scores.rank(players);
};

/**
 * Builds list of past drawings
 * @param players
 * @param gallery
 * @returns
 */
export const getNewPastDrawings = (players: Players, gallery) => {
  // Remove currentCard from players and add it to past drawings in the store
  return utils.players.getListOfPlayers(players).map((playerData) => {
    const card = playerData.currentCard;
    // Get playersSay from gallery and calculate success rate
    const galleryEntry = gallery.find((e) => e.originalId === card.id);

    card.successRate = galleryEntry.accuracy;
    return card;
  });
};

export const buildPastDrawingsDict = (drawings, publicDrawings) => {
  const newDrawings = { ...publicDrawings };

  drawings.forEach((drawing) => {
    if (newDrawings[drawing.id] === undefined) {
      newDrawings[drawing.id] = {
        id: drawing.id,
        level: drawing.level,
        text: drawing.text,
        entries: [],
      };
    }

    newDrawings[drawing.id].entries.push(
      JSON.stringify({
        playerId: drawing.playerId,
        createdAt: Date.now(),
        drawing: drawing.drawing,
        successRate: drawing.successRate,
      }),
    );
  });

  return newDrawings;
};

/**
 * Get level 5 id
 * @param arr - array of ids
 * @param index - index of the id to get
 * @param value - value to count
 * @returns - number of occurrences of value before index
 */
function countValueOccurrencesBeforeIndex(arr: number[], index: number, value: number): number {
  let count = 0;
  for (let i = 0; i < index; i++) {
    if (arr[i] === value) {
      count++;
    }
  }
  return count;
}

/**
 * Determines the type/theme of a level based on its number and special level configuration
 * @param level - The level number
 * @param specialLevels - Array of special level themes
 * @param levels - Array of all levels in the game
 * @param currentRound - The current round number
 */
export function determineLevelType(
  level: number,
  specialLevels: string[],
  levels: number[],
  currentRound: number,
) {
  const levelTypes = {
    1: 'easy',
    2: 'medium',
    3: 'hard',
    5: 'themed',
  };

  if (level !== 4) return levelTypes[level];

  return specialLevels[countValueOccurrencesBeforeIndex(levels, currentRound, 4)];
}
