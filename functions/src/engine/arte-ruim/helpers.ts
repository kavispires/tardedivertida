// Types
import { PlainObject, Players, Round } from '../../utils/types';
import { ArteRuimCard, ArteRuimDrawing, ArteRuimLevel4Card, FirebaseStoreData, PerLevelCards } from './types';
// Constants
import {
  ARTE_RUIM_PHASES,
  REGULAR_GAME_OPTIONS,
  SHORT_GAME_OPTIONS,
  GAME_OVER_SCORE_THRESHOLD,
} from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';
import { buildNewScoreObject } from '../../utils/helpers';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
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

const getEnoughUnusedLevel4Cards = (deck, usedCards: PlainObject, cardsNeeded: number): string[] => {
  let tries = 0;
  const discarded: string[] = [];
  const reserved: PlainObject = [];

  while (Object.keys(reserved).length < cardsNeeded) {
    // Makes sure the look is not infinite
    tries++;
    if (tries > 100) {
      return gameUtils.sliceIntoChunks(discarded, cardsNeeded)[0];
    }

    const cards = Object.keys(deck.pop().cards);
    // Check if any has been used
    if (cards.some((cardId) => usedCards[cardId]) && cards.some((cardId) => reserved[cardId])) {
      cards.forEach((cardId) => discarded.push(cardId));
    } else {
      cards.forEach((cardId) => (reserved[cardId] = true));
    }
  }

  return gameUtils.shuffle(Object.keys(reserved)).slice(0, cardsNeeded);
};

/**
 * Builds the deck as evenly as possible with cards needed per level
 * @param fullDeckData
 * @param perLevel
 * @returns
 */
export const buildDeck = (
  allCards: PlainObject,
  level4Deck: ArteRuimLevel4Card[],
  usedCardsIds: ArteRuimCard[],
  playerCount: number,
  useAllCards: boolean,
  gameType: string
): ArteRuimCard[] => {
  const cardsPerLevel: PerLevelCards = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  };

  const availableCards: PerLevelCards = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  };

  // Split in levels
  Object.values(allCards).forEach((entry: ArteRuimCard) => {
    cardsPerLevel[entry.level].push(entry);
    if (useAllCards || usedCardsIds[entry.id] === undefined) {
      availableCards[entry.level].push(entry);
    }
  });

  const gameOptions = gameType === 'SHORT_GAME' ? SHORT_GAME_OPTIONS : REGULAR_GAME_OPTIONS;

  const roundLevels = gameOptions.DECK_ORDER_BY_LEVEL;
  const cardsNeeded = gameOptions.CARDS_PER_PLAYER_COUNT[playerCount];

  // Check Levels Availability requirement
  if (availableCards['1'].length < cardsNeeded.perLevel['1'].length) {
    availableCards['1'] = cardsPerLevel['1'];
  }
  if (availableCards['2'].length < cardsNeeded.perLevel['2'].length) {
    availableCards['2'] = cardsPerLevel['2'];
  }
  if (availableCards['3'].length < cardsNeeded.perLevel['3'].length) {
    availableCards['3'] = cardsPerLevel['3'];
  }
  // Shuffle available decls
  availableCards['1'] = gameUtils.shuffle(availableCards['1']);
  availableCards['2'] = gameUtils.shuffle(availableCards['2']);
  availableCards['3'] = gameUtils.shuffle(availableCards['3']);

  const usedCardIdDict = {};
  const shuffledLevel4Deck = gameUtils.shuffle(level4Deck);
  let level4Hand: string[] = [];

  return Array(cardsNeeded.total)
    .fill(0)
    .map((e, i) => {
      const level = roundLevels[Math.floor((e + i) / cardsNeeded.perRound)];

      if (level === 4) {
        if (level4Hand.length === 0) {
          level4Hand = getEnoughUnusedLevel4Cards(shuffledLevel4Deck, usedCardIdDict, cardsNeeded.perRound);
        }
        const cardId = level4Hand.pop();
        if (cardId) {
          return {
            ...allCards[cardId],
            level: 4,
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
 * Determine the number of cards in a round
 * @param players
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

/**
 * Build gallery
 * @param drawings
 * @param players
 * @returns
 */
export const buildGallery = (drawings: ArteRuimDrawing[], players: Players) =>
  drawings.map((drawingEntry) => {
    const correctAnswer = `${drawingEntry.id}`;
    const artistId = drawingEntry.playerId;

    const newGalleryEntry = {
      id: drawingEntry.id,
      drawing: drawingEntry.drawing,
      artistId: drawingEntry.playerId,
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
        const currentVote = pObject.votes[correctAnswer];
        if (playersSay[currentVote] === undefined) {
          playersSay[currentVote] = [];
        }
        playersSay[currentVote].push(playerId);
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
  const newScores = buildNewScoreObject(players, [0, 0]);

  drawings.forEach((drawingEntry) => {
    const correctAnswer = `${drawingEntry.id}`;
    const artistId = drawingEntry.playerId;

    Object.entries(<PlainObject>players).forEach(([playerId, pObject]) => {
      if (artistId === playerId) return;

      if (artistId) {
        // Calculate what players say
        const currentVote = pObject.votes[correctAnswer];
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
    const galleryEntry = gallery.find((e) => e.id === card.id);
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
