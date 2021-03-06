// Types
import type { BooleanDictionary, CardId, PlainObject, Players, Round } from '../../utils/types';
import type { ArteRuimCard, ArteRuimGroup, ArteRuimPair } from '../../utils/tdr';
import type { ArteRuimDrawing, FirebaseStoreData, CardsByLevel, ResourceData } from './types';
// Constants
import {
  ARTE_RUIM_PHASES,
  GAME_OVER_SCORE_THRESHOLD,
  REGULAR_GAME_LEVELS,
  SHORT_GAME_LEVELS,
} from './constants';
// Helpers
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  isGameOver?: boolean,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, DRAW, EVALUATION, GALLERY, GAME_OVER } = ARTE_RUIM_PHASES;
  const order = [RULES, SETUP, DRAW, EVALUATION, GALLERY];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === GALLERY) {
    return triggerLastRound || round.current >= round.total ? GAME_OVER : DRAW;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return DRAW;
};

/**
 * Determine if a player has passed max points and it should be game over
 * @param players
 * @returns
 */
export const determineGameOver = (players: Players, round: Round): boolean => {
  // In a short game, the points threshold doesn't count
  if (round.total === 5) return false;

  return Object.values(players).some((player) => player.score >= GAME_OVER_SCORE_THRESHOLD);
};

/**
 * Get game settings
 * @param isShortGame
 * @returns
 */
export const getGameSettings = (isShortGame: boolean) => {
  return {
    MAX_ROUNDS: isShortGame ? SHORT_GAME_LEVELS.length : REGULAR_GAME_LEVELS.length,
    LEVELS: isShortGame ? SHORT_GAME_LEVELS : REGULAR_GAME_LEVELS,
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

export const getAvailableCards = (
  cardsByLevel: CardsByLevel,
  usedCardsIds: BooleanDictionary,
  roundLevels: number[],
  playerCount: number
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
 * Get enough level 4 cards
 * @param deck
 * @param usedCards
 * @param cardsNeeded
 * @returns
 */
const getEnoughUnusedLevel4Cards = (
  deck: ArteRuimGroup[],
  usedCards: PlainObject,
  cardsNeeded: number
): string[] => {
  let tries = 0;
  const discarded: string[] = [];
  const reserved: PlainObject = [];

  while (Object.keys(reserved).length < cardsNeeded) {
    // Makes sure the look is not infinite
    tries++;
    if (tries > 100) {
      return utils.game.sliceIntoChunks(discarded, cardsNeeded)[0];
    }
    const selected = deck.pop();
    if (selected) {
      const cards = Object.keys(selected.cards);
      // Check if any has been used
      if (cards.some((cardId) => usedCards[cardId]) && cards.some((cardId) => reserved[cardId])) {
        cards.forEach((cardId) => discarded.push(cardId));
      } else {
        cards.forEach((cardId) => (reserved[cardId] = true));
      }
    }
  }

  return utils.game.shuffle(Object.keys(reserved)).slice(0, cardsNeeded);
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
  isShortGame: boolean
): ArteRuimCard[] => {
  const levels = isShortGame ? SHORT_GAME_LEVELS : REGULAR_GAME_LEVELS;
  const cardsPerRound = determineNumberOfCards(playerCount);
  const cardsNeeded = levels.length * cardsPerRound;

  const { allCards, availableCards, cardsGroups, cardsPairs } = resourceData;

  // Shuffle available decls
  availableCards[1] = utils.game.shuffle(availableCards[1]);
  availableCards[2] = utils.game.shuffle(availableCards[2]);
  availableCards[3] = utils.game.shuffle(availableCards[3]);

  const usedCardIdDict = {};
  const shuffledLevel4Deck = utils.game.shuffle(cardsGroups);
  let level4Hand: CardId[] = [];
  const shuffledLevel5Deck = utils.game.shuffle(cardsPairs);
  const availableLevel5Cards = getEnoughLevel5Cards(shuffledLevel5Deck, cardsPerRound);

  return Array(cardsNeeded)
    .fill(0)
    .map((e, i) => {
      const level = levels[Math.floor((e + i) / cardsPerRound)];

      // Level 4 (cards within a common theme)
      if (level === 4) {
        // When no level 4 cards are available, fetch a new hand with the minimum needed for a round
        if (level4Hand.length === 0) {
          level4Hand = getEnoughUnusedLevel4Cards(shuffledLevel4Deck, usedCardIdDict, cardsPerRound);
        }
        const cardId = level4Hand.pop();
        if (cardId) {
          return {
            ...allCards[cardId],
            level: 4,
          };
        }
      }
      // Only two similar cards
      else if (level === 5) {
        const card = availableLevel5Cards.pop();
        if (card) {
          return card;
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

const getEnoughLevel5Cards = (cards: ArteRuimPair[], playerCount: number) => {
  let result: ArteRuimCard[] = [];

  function buildNecessaryArray(card: ArteRuimPair, count: number): ArteRuimCard[] {
    const newCards: ArteRuimCard[] = card.values.map((value, index) => ({
      id: `${card.id}--${index}`,
      text: value,
      level: 5,
    }));

    const cardsArr0 = new Array(count * 2).fill(newCards[0]).map((c, i) => ({ ...c, id: `${c.id}--${i}` }));
    const cardsArr1 = new Array(count * 2).fill(newCards[1]).map((c, i) => ({ ...c, id: `${c.id}--${i}` }));
    // From an array composed of twice the numbers of players for each card,
    // return an array with the exact number of players
    const randomCards = utils.game.getRandomItems([...cardsArr0, ...cardsArr1], count - 2);
    // Guarantee that there's at least one of each
    return utils.game.getRandomItems([newCards[0], newCards[1], ...randomCards], count);
  }

  // Get 2 pairs
  [cards[0], cards[1]].forEach((card) => {
    result = result.concat(buildNecessaryArray(card, playerCount));
  });

  return result;
};

/**
 * Returns a unique set of cards
 * @param cards
 * @returns
 */
export const getTheTwoLevel5Cards = (cards: ArteRuimCard[]): ArteRuimCard[] => {
  const cache: BooleanDictionary = {};

  const selectedCards = cards.filter((card) => {
    if (cache[card.text] === undefined) {
      cache[card.text] = true;
      return true;
    }
    return false;
  });

  return selectedCards.map((card) => ({
    ...card,
    id: getLevel5Id(card.id),
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
  const playersArray = Object.values(players);
  const numberOfCards = determineNumberOfCards(playersArray.length);

  store.currentCards = new Array(numberOfCards).fill(0).map((i, index) => {
    const currentPlayerId = playersArray?.[index]?.id ?? null;
    const card = {
      ...store.deck.pop(),
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

const getLevel5Id = (id: string): string => {
  const split = id.split('--');
  return split.length === 1 ? id : `${split[0]}--${split[1]}`;
};

/**
 * Build gallery
 * @param drawings
 * @param players
 * @returns
 */
export const buildGallery = (drawings: ArteRuimDrawing[], players: Players) =>
  drawings.map((drawingEntry) => {
    const correctAnswer = getLevel5Id(drawingEntry.id);
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
    };

    const playersSay = {};
    const playersPoints = {};

    Object.entries(<PlainObject>players).forEach(([playerId, pObject]) => {
      if (artistId === playerId) return;

      if (artistId) {
        // Calculate what players say
        const currentVote = getLevel5Id(pObject.votes[drawingEntry.id]);

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
        }
      }
    });
    newGalleryEntry.playersSay = playersSay;
    newGalleryEntry.playersPoints = playersPoints;
    return newGalleryEntry;
  });

/**
 * Build round ranking
 * @param drawings
 * @param players
 * @returns
 */
export const buildRanking = (drawings: ArteRuimDrawing[], players: Players) => {
  const newScores = utils.helpers.buildNewScoreObject(players, [0, 0]);

  drawings.forEach((drawingEntry) => {
    const correctAnswer = getLevel5Id(drawingEntry.id);
    const artistId = drawingEntry.playerId;

    Object.entries(<PlainObject>players).forEach(([playerId, pObject]) => {
      if (artistId === playerId) return;

      if (artistId) {
        // Calculate what players say
        const currentVote = getLevel5Id(pObject.votes[drawingEntry.id]);

        // Calculate player points
        if (currentVote === correctAnswer) {
          newScores[playerId].gainedPoints[0] += 2;
          newScores[playerId].newScore += 2;
          players[playerId].score += 2;
          newScores[artistId].gainedPoints[1] += 1;
          newScores[artistId].newScore += 1;
          players[artistId].score += 1;
        }
      }
    });
  });

  return Object.values(newScores).sort((a, b) => (a.newScore > b.newScore ? 1 : -1));
};

/**
 * Builds list of past drawings
 * @param players
 * @param gallery
 * @returns
 */
export const getNewPastDrawings = (players: Players, gallery) => {
  const playerCount = Object.keys(players).length;
  // Remove currentCard from players and add it to past drawings in the store
  return Object.values(players).map((playerData) => {
    const card = playerData.currentCard;
    // Get playersSay from gallery and calculate success rate
    const galleryEntry = gallery.find((e) => e.originalId === card.id);
    const correctAnswers = galleryEntry.playersSay?.[card.id]?.length ?? 0;

    card.successRate = Math.round((100 * correctAnswers) / (playerCount - 1)) / 100;
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
      })
    );
  });

  return newDrawings;
};
